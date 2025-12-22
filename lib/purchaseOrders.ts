// Purchase Order Management Utilities
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export type POStatus = 'draft' | 'pending' | 'confirmed' | 'received' | 'cancelled';

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  status: POStatus;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface POLineItem {
  id: string;
  po_id: string;
  inventory_item_id: string;
  supplier_sku?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  received_quantity: number;
}

export interface CreatePOInput {
  supplier_id: string;
  expected_delivery_date?: Date;
  items: Array<{
    inventory_item_id: string;
    supplier_sku?: string;
    quantity: number;
    unit_price: number;
  }>;
  notes?: string;
}

// Generate PO Number
function generatePONumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `PO-${new Date().getFullYear()}-${timestamp}`;
}

// Create new purchase order
export async function createPurchaseOrder(
  restaurantId: string,
  userId: string,
  data: CreatePOInput
): Promise<PurchaseOrder> {
  const supabase = createServerComponentClient({ cookies });
  const poNumber = generatePONumber();
  
  // Calculate totals
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  const { data: po, error } = await supabase
    .from('purchase_orders')
    .insert([{
      restaurant_id: restaurantId,
      po_number: poNumber,
      supplier_id: data.supplier_id,
      expected_delivery_date: data.expected_delivery_date,
      status: 'draft',
      subtotal,
      tax,
      shipping_cost: 0,
      total,
      notes: data.notes,
      created_by: userId,
    }])
    .select()
    .single();
    
  if (error) throw new Error(`Failed to create PO: ${error.message}`);
  
  // Add line items
  const lineItems = data.items.map(item => ({
    po_id: po.id,
    inventory_item_id: item.inventory_item_id,
    supplier_sku: item.supplier_sku,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: item.quantity * item.unit_price,
    received_quantity: 0,
  }));
  
  const { error: lineError } = await supabase
    .from('po_line_items')
    .insert(lineItems);
    
  if (lineError) throw new Error(`Failed to add line items: ${lineError.message}`);
  
  return po as PurchaseOrder;
}

// Get purchase orders with filters
export async function getPurchaseOrders(
  restaurantId: string,
  filters?: { status?: POStatus; supplierId?: string; limit?: number }
) {
  const supabase = createServerComponentClient({ cookies });
  
  let query = supabase
    .from('purchase_orders')
    .select('*')
    .eq('restaurant_id', restaurantId);
    
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.supplierId) {
    query = query.eq('supplier_id', filters.supplierId);
  }
  
  const { data: pos, error } = await query
    .order('created_at', { ascending: false })
    .limit(filters?.limit || 50);
    
  if (error) throw new Error(`Failed to fetch POs: ${error.message}`);
  return pos as PurchaseOrder[];
}

// Get PO with line items
export async function getPODetail(poId: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: po, error: poError } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('id', poId)
    .single();
    
  if (poError) throw new Error(`Failed to fetch PO: ${poError.message}`);
  
  const { data: items, error: itemsError } = await supabase
    .from('po_line_items')
    .select('*')
    .eq('po_id', poId);
    
  if (itemsError) throw new Error(`Failed to fetch line items: ${itemsError.message}`);
  
  return { po, items };
}

// Update PO status
export async function updatePOStatus(
  poId: string,
  status: POStatus
): Promise<void> {
  const supabase = createServerComponentClient({ cookies });
  
  const { error } = await supabase
    .from('purchase_orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', poId);
    
  if (error) throw new Error(`Failed to update PO: ${error.message}`);
}

// Receive purchase order
export async function receivePurchaseOrder(
  poId: string,
  items: Array<{ lineItemId: string; quantityReceived: number }>
): Promise<void> {
  const supabase = createServerComponentClient({ cookies });
  
  // Update line items with received quantities
  for (const item of items) {
    await supabase
      .from('po_line_items')
      .update({ received_quantity: item.quantityReceived })
      .eq('id', item.lineItemId);
  }
  
  // Update PO status
  await updatePOStatus(poId, 'received');
}

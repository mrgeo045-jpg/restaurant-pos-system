// Supabase table models for Restaurant POS System
// These interfaces map directly to the database tables

export interface MenuItemRow {
  id: string;
  name_ar: string;
  name_en: string;
  category: string;
  price: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TableRow {
  id: string;
  number_ar: string;
  number_en: string;
  capacity: number;
  status: 'empty' | 'occupied' | 'pending_payment';
  number_of_guests?: number;
  current_order_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  item_id: string;
  name_ar: string;
  name_en: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes?: string;
  created_at: string;
}

export interface OrderRow {
  id: string;
  table_id: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: 'open' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface BillSplitPersonRow {
  id: string;
  order_id: string;
  person_name: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  created_at: string;
}

export interface BillSplitItemRow {
  id: string;
  bill_split_person_id: string;
  order_item_id: string;
  quantity: number;
  created_at: string;
}

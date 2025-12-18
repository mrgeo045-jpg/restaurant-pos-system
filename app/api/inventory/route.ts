import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface InventoryItem {
  id: string;
  product_name: string;
  product_code: string;
  quantity_on_hand: number;
  reorder_level: number;
  unit_price: number;
  warehouse: string;
  last_updated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// GET - Fetch all inventory items
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('product_name');

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Map data with status
    const inventoryWithStatus = (data || []).map((item: any) => ({
      ...item,
      status: getInventoryStatus(item.quantity_on_hand, item.reorder_level)
    }));

    return NextResponse.json(inventoryWithStatus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

// POST - Create new inventory item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('inventory')
      .insert([
        {
          product_name: body.product_name,
          product_code: body.product_code,
          quantity_on_hand: body.quantity_on_hand || 0,
          reorder_level: body.reorder_level || 10,
          unit_price: body.unit_price || 0,
          warehouse: body.warehouse || 'مستودع رئيسي',
          last_updated: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}

// Helper function to determine inventory status
function getInventoryStatus(
  quantity: number,
  reorderLevel: number
): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (quantity === 0) return 'out_of_stock';
  if (quantity <= reorderLevel) return 'low_stock';
  return 'in_stock';
}

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { checkPermission } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPermission = await checkPermission(user.id, 'tables:merge');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { source_table_id, target_table_id } = body;

    if (!source_table_id || !target_table_id) {
      return NextResponse.json(
        { error: 'Source and target table IDs are required' },
        { status: 400 }
      );
    }

    // Fetch source table orders
    const { data: sourceOrders, error: sourceError } = await supabase
      .from('orders')
      .select('*')
      .eq('table_id', source_table_id);

    if (sourceError) throw sourceError;

    // Move all orders from source to target table
    if (sourceOrders && sourceOrders.length > 0) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ table_id: target_table_id })
        .eq('table_id', source_table_id);

      if (updateError) throw updateError;
    }

    // Update source table status to merged
    const { data: mergedTable, error: mergeError } = await supabase
      .from('tables')
      .update({
        status: 'merged',
        merged_with: target_table_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', source_table_id)
      .select()
      .single();

    if (mergeError) throw mergeError;

    // Fetch merged target table data
    const { data: targetTable } = await supabase
      .from('tables')
      .select('*')
      .eq('id', target_table_id)
      .single();

    // Log activity
    await logActivity(
      user.id,
      'merge_tables',
      `Merged table ${source_table_id} into ${target_table_id}`,
      'tables',
      target_table_id
    );

    return NextResponse.json({
      message: 'Tables merged successfully',
      merged_table: mergedTable,
      target_table: targetTable,
    });
  } catch (error) {
    console.error('Error merging tables:', error);
    return NextResponse.json(
      { error: 'Failed to merge tables' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    await signOut();

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

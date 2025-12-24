import { NextRequest, NextResponse } from 'next/server';
import { generateSecret, generateBackupCodes } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate 2FA secret
    const secretResult = await generateSecret({ userEmail: email });

    if (!secretResult.success) {
      return NextResponse.json(
        { error: secretResult.error },
        { status: 400 }
      );
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes(10);

    return NextResponse.json(
      {
        secret: secretResult.secret,
        qrCode: secretResult.qrCode,
        backupCodes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Setup 2FA error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

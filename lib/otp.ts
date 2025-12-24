import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

interface GenerateSecretOptions {
  userEmail: string;
  appName?: string;
}

export async function generateSecret(options: GenerateSecretOptions) {
  try {
    const secret = speakeasy.generateSecret({
      name: `${options.appName || 'Restaurant POS'} (${options.userEmail})`,
      issuer: options.appName || 'Restaurant POS System',
      length: 32,
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

    return {
      success: true,
      secret: secret.base32,
      qrCode,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export function verifyToken(secret: string, token: string): boolean {
  try {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2,
    });

    return verified !== false;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}

export function verifyBackupCode(
  backupCodes: string[],
  code: string
): { valid: boolean; remaining: string[] } {
  const index = backupCodes.indexOf(code.toUpperCase());
  if (index === -1) {
    return { valid: false, remaining: backupCodes };
  }

  const remaining = backupCodes.filter((_, i) => i !== index);
  return { valid: true, remaining };
}

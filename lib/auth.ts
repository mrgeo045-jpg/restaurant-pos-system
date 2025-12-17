import { cookies } from 'next/headers';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier' | 'kitchen';
}

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400 * 7,
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value;
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  if (!validateEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }
  if (!validatePassword(password)) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }
  const mockUsers: Record<string, { password: string; user: AuthUser }> = {
    'admin@restaurant.com': {
      password: 'admin123',
      user: { id: '1', email: 'admin@restaurant.com', name: 'مدير', role: 'admin' },
    },
    'manager@restaurant.com': {
      password: 'manager123',
      user: { id: '2', email: 'manager@restaurant.com', name: 'مدير العمليات', role: 'manager' },
    },
    'cashier@restaurant.com': {
      password: 'cashier123',
      user: { id: '3', email: 'cashier@restaurant.com', name: 'كاشير', role: 'cashier' },
    },
  };
  const userRecord = mockUsers[email];
  if (!userRecord || userRecord.password !== password) {
    return { success: false, error: 'Invalid email or password' };
  }
  const token = Buffer.from(JSON.stringify(userRecord.user)).toString('base64');
  await setAuthToken(token);
  return { success: true, user: userRecord.user };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getAuthToken();
  if (!token) return null;
  try {
    const user = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return user as AuthUser;
  } catch {
    return null;
  }
}

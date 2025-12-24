'use client';

// Client-side authentication utilities that integrate with API routes
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier' | 'kitchen';
}

export interface LoginResult {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}

export interface SignupResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Login user via API endpoint
 * Calls POST /api/auth/login with email and password
 */
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    if (!validateEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }
    if (!validatePassword(password)) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Login failed',
      };
    }

    // Store user data in localStorage
    if (data.user) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token || '');
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Network error or server unavailable',
    };
  }
}

/**
 * Sign up new user via API endpoint
 * Calls POST /api/auth/signup with email, password, and role
 */
export async function signupUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'manager' | 'cashier' | 'kitchen' = 'cashier'
): Promise<SignupResult> {
  try {
    if (!validateEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }
    if (!validatePassword(password)) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Name is required' };
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Signup failed',
      };
    }

    // Auto-login after signup
    if (data.user) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token || '');
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: 'Network error or server unavailable',
    };
  }
}

/**
 * Get current logged-in user from localStorage
 */
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Logout user - clear stored auth data
 */
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('currentUser');
  localStorage.removeItem('authToken');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null && getAuthToken() !== null;
}

/**
 * Check if user has required role
 */
export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(roles: string[]): boolean {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
}

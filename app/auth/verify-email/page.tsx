'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

type VerificationStatus = 'verifying' | 'success' | 'error' | 'resending' | 'idle';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;
    
    setStatus('verifying');
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Email verification failed');
      }

      setStatus('success');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) return;
    
    setResendLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, resend: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }

      setStatus('idle');
      setError('Verification email sent! Check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>Confirm your email address to activate your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <AlertDescription className="text-green-800 dark:text-green-200">Email verified successfully! Redirecting to login...</AlertDescription>
              </Alert>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {!token && status === 'idle' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Mail className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Check your email for a verification link.
              </p>
              {email && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Sent to: <span className="font-medium">{email}</span>
                  </p>
                  <Button
                    onClick={resendVerificationEmail}
                    disabled={resendLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {resendLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {error && status !== 'error' && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <AlertDescription className="text-blue-800 dark:text-blue-200">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <div className="px-6 py-4 border-t text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already verified? <Link href="/auth/login" className="text-blue-600 hover:underline">Back to login</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

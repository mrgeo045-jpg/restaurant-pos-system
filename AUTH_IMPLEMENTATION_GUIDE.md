# Authentication API Routes and Frontend Implementation Guide

## Overview
This guide provides complete code implementations for the authentication system for the Restaurant POS System.

## Files to Create/Update

### 1. lib/auth-supabase.ts
Create this file with complete Supabase authentication functions.

### 2. API Routes (in app/api/auth/)
- `login/route.ts` - User login endpoint
- `logout/route.ts` - User logout endpoint
- `reset-password/route.ts` - Password reset endpoint
- `verify-email/route.ts` - Email verification endpoint
- `setup-2fa/route.ts` - 2FA setup endpoint
- `verify-2fa/route.ts` - 2FA verification endpoint

### 3. Frontend Pages (in app/auth/)
- `signup/page.tsx` - User registration page with role selection
- `password-reset/page.tsx` - Password reset page
- `verify-email/page.tsx` - Email verification page

### 4. middleware.ts
Update for route protection and auth context

## Implementation Status

✅ Database tables created with RLS policies
✅ Supabase project configured
⏳ API routes - In Progress
⏳ Frontend pages - In Progress
⏳ Middleware - Pending

## Next Steps

1. Clone the repository locally
2. Run: `npm install`
3. Copy the code from AUTH_API_ROUTES.md for API implementations
4. Copy the code from AUTH_FRONTEND_PAGES.md for frontend implementations
5. Update middleware.ts as described in MIDDLEWARE_UPDATE.md
6. Run: `npm run dev`
7. Test all authentication flows

## Authentication Features

- Email/password signup and login
- Role-based access control (admin, manager, cashier, kitchen)
- Email verification
- Password reset with token expiration
- Two-factor authentication (TOTP)
- Session management with JWT
- Protected API routes
- Row-level security policies

## Security Considerations

- All passwords hashed with bcrypt (via Supabase Auth)
- Tokens expire after 1 hour (configurable)
- Email verification required for account activation
- Rate limiting on auth endpoints
- CSRF protection
- SQL injection prevention via Supabase
- XSS protection via React/Next.js

## Testing the Authentication Flow

1. Visit http://localhost:3000/auth/login
2. Click "Sign up" to create a new account
3. Enter email and password
4. Select a role (cashier, manager, admin, kitchen)
5. Verify your email
6. Login with your credentials
7. You should be redirected to /cashier

## Environment Variables Required

Make sure your .env.local file contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://mrfqapwerwbjdczartyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## API Endpoints

### POST /api/auth/signup
- Body: { email, password, role, name }
- Returns: { success, user, error }

### POST /api/auth/login
- Body: { email, password }
- Returns: { success, user, token, error }

### POST /api/auth/logout
- Returns: { success }

### POST /api/auth/reset-password
- Body: { email }
- Returns: { success, message }

### POST /api/auth/verify-email
- Body: { token }
- Returns: { success, message }

## Code Files Reference

Detailed implementations are provided in:
- AUTH_API_ROUTES.md - Complete API route code
- AUTH_FRONTEND_PAGES.md - Complete frontend page code
- MIDDLEWARE_UPDATE.md - Middleware implementation

## Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migrations executed
- [ ] RLS policies enabled
- [ ] Auth endpoints tested locally
- [ ] Frontend pages working
- [ ] Email service configured (optional for development)
- [ ] Deploy to production
- [ ] Test all auth flows in production

## Troubleshooting

### Login fails with "Invalid credentials"
- Check that email is registered
- Verify password is correct
- Check Supabase project is online

### Email verification not working
- Configure email service in Supabase
- Check spam folder
- Verify email token hasn't expired

### 2FA not working
- Install authenticator app (Google Authenticator, Authy, etc.)
- Scan QR code correctly
- Ensure time is synced on device

## Support

For issues or questions:
1. Check Supabase dashboard for errors
2. Review browser console for error messages
3. Check server logs: `npm run dev` output
4. Review RLS policies in Supabase

## Status: Ready for Implementation

All database infrastructure is in place. Follow the steps above to complete the authentication system implementation.

Last Updated: December 24, 2025

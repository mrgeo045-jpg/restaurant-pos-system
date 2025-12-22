# Advanced User Management Implementation Guide

## Overview
This guide provides complete implementation for advanced user management system with RBAC, user creation/deletion, and permission enforcement.

## Completed
✅ Database schema design
✅ Basic API endpoints

## What We're Implementing
1. Enhanced user management dashboard page
2. Complete user CRUD API endpoints
3. Role-based access control (RBAC) middleware
4. Permission enforcement on routes and APIs
5. User creation/updating/deletion from dashboard
6. User activity tracking
7. Bulk user operations

## Architecture

### 1. API Endpoints
We'll create comprehensive REST API endpoints under `app/api/users/`:

```
GET    /api/users               - List all users (paginated, filtered)
GET    /api/users/:id          - Get user details
POST   /api/users              - Create new user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
POST   /api/users/:id/toggle   - Toggle user active/inactive status
GET    /api/users/roles/check  - Check user permissions
POST   /api/users/bulk-import  - Bulk import users
GET    /api/users/logs/activity - Get user activity logs
```

### 2. RBAC Implementation

Role Hierarchy and Permissions:
```
ADMIN:
  - Can create/delete/edit all users
  - Can assign roles
  - Can view audit logs
  - Full system access
  
MANAGER:
  - Can create/edit cashiers and kitchen staff
  - Cannot delete admin or other managers
  - Can deactivate users
  - Can view reports
  
CASHIER:
  - Read-only access to own profile
  - Cannot manage users
  - Can view menu and orders
  
KITCHEN:
  - Read-only access to own profile
  - Cannot manage users
  - Can view assigned orders
```

### 3. Database Enhancements

New table: `user_activity_logs`
```sql
CREATE TABLE user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  target_user_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_activity_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity_logs(created_at);
```

## File Structure

```
app/
├── api/
│   └── users/
│       ├── route.ts              # GET /users, POST /users
│       ├── [id]/
│       │   └── route.ts          # GET, PUT, DELETE /users/:id
│       ├── [id]/
│       │   └── toggle/
│       │       └── route.ts      # POST /users/:id/toggle
│       ├── logs/
│       │   └── activity/
│       │       └── route.ts      # GET /users/logs/activity
│       └── bulk-import/
│           └── route.ts          # POST /users/bulk-import
│
├── admin/
│   ├── users/
│   │   ├── page.tsx              # User management dashboard
│   │   ├── [id]/
│   │   │   └── page.tsx          # Edit user page
│   │   └── create/
│   │       └── page.tsx          # Create user page
│   │
│   └── layout.tsx                # Admin layout with protection
│
├── middleware.ts                 # Enhanced with RBAC
│
lib/
├── rbac.ts                       # Role-based access control
├── permissions.ts                # Permission definitions
└── user-service.ts               # User business logic
```

## Implementation Steps

### Step 1: Create RBAC Utilities

Create `lib/rbac.ts`:
- Define role hierarchy
- Permission checker functions
- middleware for route protection

### Step 2: Create User API Endpoints

Create `app/api/users/route.ts`:
- GET /users with pagination and filtering
- POST /users to create new user
- Add RBAC checks

### Step 3: Create User Management Dashboard

Update `app/admin/users/page.tsx`:
- Display users table with sorting/filtering
- Edit/delete user modals
- Create user form
- Activity logs viewer

### Step 4: Implement Middleware Protection

Enhance `middleware.ts`:
- Check user role on protected routes
- Redirect unauthorized users
- Validate permissions

### Step 5: Add Activity Logging

Create logging system:
- Log all user management actions
- Track IP and user agent
- Create audit trail

## Security Considerations

1. **Password Security**
   - Use Supabase Auth for password hashing
   - Implement password strength requirements
   - Support password reset

2. **Permission Enforcement**
   - Check permissions on every API call
   - Validate at both API and database level (RLS)
   - Use Row-Level Security in Supabase

3. **Audit Logging**
   - Log all user management actions
   - Include timestamps and user IDs
   - Preserve historical data

4. **Data Protection**
   - Encrypt sensitive user data
   - Use HTTPS only
   - Implement CSRF protection

## Testing

Test cases to implement:

1. **Permission Tests**
   - Admin can create users
   - Manager can create cashiers
   - Cashiers cannot create users

2. **CRUD Tests**
   - Create user with all roles
   - Update user details
   - Delete user
   - Toggle user status

3. **Validation Tests**
   - Invalid email format
   - Duplicate email
   - Required fields
   - Role validation

4. **Permission Enforcement**
   - Access denied for unauthorized users
   - Proper error messages
   - Redirect to login

## Deployment Notes

1. Update Supabase RLS policies
2. Create activity_logs table
3. Set environment variables
4. Test all permissions in production
5. Monitor audit logs

## Future Enhancements

1. **Bulk Operations**
   - Import users from CSV
   - Export user list
   - Batch role changes

2. **Advanced Features**
   - User groups/departments
   - Delegation of admin duties
   - Time-limited access
   - SSO integration

3. **Analytics**
   - User activity analytics
   - Login patterns
   - Permission usage

## Next Steps

1. Create lib/rbac.ts with role definitions
2. Implement comprehensive API endpoints
3. Build user management UI dashboard
4. Add activity logging
5. Test all permission scenarios
6. Document endpoints with examples

Status: Implementation in progress - Full user management system with RBAC

# FR-001: Email/Password Signup with Verification

Issue: https://github.com/learnednomad/sabron-trip-sync/issues/21

## Current State Analysis

### Already Implemented:
1. **Backend API** (`services/api/src/index.ts`):
   - `/auth/register` endpoint exists with proper validation
   - Uses `RegisterSchema` from `@sabron/validation`
   - Supabase integration for user creation

2. **Validation Package** (`packages/validation/src/auth.ts`):
   - Complete `RegisterSchema` with all required validation
   - `PasswordSchema` enforces: 8+ chars, uppercase, lowercase, numbers, special chars
   - Email validation and sanitization

3. **Mobile App**:
   - Basic auth store with signUp method (`apps/trip-sync-mobile/src/lib/auth/index.tsx`)
   - Register page exists (`apps/trip-sync-mobile/src/app/register.tsx`)
   - RegisterForm component with basic validation (needs update)
   - Supabase client configured

4. **Web App**:
   - Auth provider with signUp method (`apps/web/src/providers/auth-provider.tsx`)
   - Email redirect URL for verification configured

### What's Missing:
1. **Mobile App**:
   - Update RegisterForm to use shared validation schema
   - Password validation doesn't match requirements (currently 6 chars, needs 8+)
   - No special character requirement in current validation

2. **Web App**:
   - No signup UI component
   - No signup page/route

3. **Email Verification**:
   - Need to ensure Supabase email templates are configured
   - Need callback route for email verification

## Implementation Plan

### Phase 1: Update Mobile Validation
1. Update `apps/trip-sync-mobile/src/components/register-form.tsx` to use `@sabron/validation` RegisterSchema
2. Ensure password validation matches requirements

### Phase 2: Create Web Signup UI
1. Create signup form component using shadcn/ui
2. Create signup page route
3. Integrate with auth provider

### Phase 3: Email Verification Flow
1. Create email verification callback route for web
2. Create email verification handler for mobile deep linking
3. Test email delivery

### Phase 4: Testing
1. Write unit tests for validation
2. Write integration tests for auth flow
3. Test on iOS simulator
4. Test web signup flow

## Technical Details

### Password Requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character

### Email Verification Flow:
1. User signs up → Supabase sends verification email
2. Email contains link with token
3. Web: Redirects to `/auth/callback`
4. Mobile: Deep link handling
5. Account activated upon verification

### API Endpoints:
- `POST /auth/register` - Already implemented
- Validation uses `RegisterSchema` from `@sabron/validation`

### Environment Variables Required:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` (backend only)
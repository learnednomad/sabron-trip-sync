# Supabase Authentication Setup Guide

This guide covers the complete setup process for Supabase authentication in the Sabron Trip Sync project.

## Dashboard Configuration

### 1. Site URL Configuration

In your Supabase dashboard, configure the following URLs under **Authentication > Settings**:

**Site URL:**
- Development: `http://localhost:3001`
- Production: `https://your-domain.com`

**Redirect URLs:**
```
# Web Application Callbacks
http://localhost:3001/auth/callback
https://your-domain.com/auth/callback

# Mobile Deep Link Callbacks
exp://192.168.1.100:8081/--/auth-callback
exp://localhost:8081/--/auth-callback
your-app-scheme://auth-callback
```

### 2. Email Templates

Navigate to **Authentication > Email Templates** and configure:

#### Confirm Signup Template
```html
<h2>Welcome to Sabron Trip Sync!</h2>
<p>Thanks for signing up! Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't create this account, you can safely ignore this email.</p>
```

#### Reset Password Template
```html
<h2>Reset Your Password</h2>
<p>You requested to reset your password for Sabron Trip Sync.</p>
<p><a href="{{ .ConfirmationURL }}">Reset your password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this reset, you can safely ignore this email.</p>
```

#### Magic Link Template
```html
<h2>Sign in to Sabron Trip Sync</h2>
<p>Click the link below to sign in to your account:</p>
<p><a href="{{ .ConfirmationURL }}">Sign in</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this link, you can safely ignore this email.</p>
```

### 3. Custom SMTP (Optional)

For branded emails, configure custom SMTP under **Settings > General > SMTP Settings**:

```
SMTP Host: smtp.your-provider.com
SMTP Port: 587
SMTP User: your-email@your-domain.com
SMTP Pass: your-app-password
Sender Email: noreply@your-domain.com
Sender Name: Sabron Trip Sync
```

## Environment Variables

Ensure these environment variables are set:

### Web Application (.env.local)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Mobile Application (.env.local)
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API URL
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Authentication Flow

### Email/Password Signup Flow

1. **User Registration:**
   - User fills out signup form with email, password, name
   - Password validation (8+ chars, mixed case, numbers, symbols)
   - Terms acceptance required

2. **Email Verification:**
   - Supabase sends confirmation email with `token_hash` and `type=signup`
   - User clicks link → redirected to `/auth/callback?token_hash=...&type=signup`
   - System verifies OTP using `supabase.auth.verifyOtp()`
   - Success → redirect to dashboard with verified=true

3. **Error Handling:**
   - Invalid/expired tokens → redirect to `/auth/auth-code-error`
   - Clear error messages for users

### Password Reset Flow

1. **Request Reset:**
   - User enters email on forgot password page
   - System calls `supabase.auth.resetPasswordForEmail()`
   - Redirect URL: `/auth/callback?type=recovery`

2. **Reset Password:**
   - User clicks email link → `/auth/callback?token_hash=...&type=recovery`
   - System verifies OTP and redirects to `/reset-password`
   - User enters new password → `supabase.auth.updateUser()`

### Mobile Deep Linking

For mobile authentication, configure deep linking in `app.json`:

```json
{
  "expo": {
    "scheme": "sabron-trip-sync",
    "web": {
      "bundler": "metro"
    }
  }
}
```

## Security Best Practices

1. **RLS Policies:** Enable Row Level Security on all tables
2. **JWT Expiry:** Configure appropriate session timeout (default: 1 hour)
3. **Rate Limiting:** Enable rate limiting for auth endpoints
4. **HTTPS Only:** Always use HTTPS in production
5. **Secure Cookies:** Configure secure cookie settings

## Testing Checklist

- [ ] Email signup with verification works
- [ ] Password reset flow completes successfully
- [ ] Mobile deep linking handles auth callbacks
- [ ] Error pages display for invalid tokens
- [ ] Rate limiting prevents abuse
- [ ] Email templates render correctly
- [ ] SMTP configuration sends emails (if using custom SMTP)

## Troubleshooting

### Common Issues

1. **"Invalid token" errors:**
   - Check redirect URLs in Supabase dashboard
   - Verify EmailOtpType handling in callback routes

2. **Mobile deep linking not working:**
   - Ensure URL scheme is registered in app.json
   - Check expo-linking configuration

3. **Emails not sending:**
   - Verify SMTP settings
   - Check spam folders
   - Validate email template syntax

4. **Redirect loops:**
   - Check auth state management
   - Verify middleware configuration

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
EXPO_PUBLIC_SUPABASE_DEBUG=true
```
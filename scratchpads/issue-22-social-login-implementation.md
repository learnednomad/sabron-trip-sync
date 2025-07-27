# Issue #22: Social Login Implementation Plan

**Issue URL**: https://github.com/learnednomad/sabron-trip-sync/issues/22  
**Feature**: FR-002: Social login (Google/Apple/Facebook)  
**Date**: 2025-07-27  

## 📋 Current State Analysis

### ✅ Already Implemented
- **Types & Validation**: Social auth types defined in `packages/validation/src/auth.ts` and `packages/types/src/auth.ts`
- **Mobile UI Placeholder**: Social login buttons exist in `apps/trip-sync-mobile/src/components/login-form.tsx` (lines 45-67)
- **Auth Infrastructure**: Supabase auth setup with email/password
- **Auth Callback Route**: Web callback route handles OAuth flows (`apps/web/src/app/auth/callback/route.ts`)

### ❌ Missing Implementation
- Social auth methods in auth providers
- Web social login UI components
- Supabase OAuth provider configuration
- Mobile Expo AuthSession implementation
- Account linking/merging logic
- Profile data synchronization

## 🎯 Implementation Strategy

### Phase 1: Foundation Setup
1. **Supabase Provider Configuration** (Manual Setup Required)
   - Configure Google OAuth in Supabase dashboard
   - Configure Apple Sign-In in Supabase dashboard  
   - Configure Facebook OAuth in Supabase dashboard
   - Set up redirect URIs for web and mobile

2. **Update Auth Provider (Web)**
   - Add `signInWithGoogle`, `signInWithApple`, `signInWithFacebook` methods
   - Implement OAuth flow with Supabase `signInWithOAuth`
   - Add account linking detection and handling
   - Add profile sync logic

### Phase 2: Web Implementation
1. **Create Social Login Components**
   - `SocialLoginButton` component for individual providers
   - `SocialLoginGroup` component with divider and multiple providers
   - Add loading states and error handling

2. **Update Web Login Form**
   - Add social login buttons to `LoginForm.tsx`
   - Add social login to `SignupForm.tsx`
   - Implement consistent styling with existing forms

### Phase 3: Mobile Implementation
1. **Setup Expo AuthSession**
   - Install and configure `expo-auth-session`
   - Configure deep linking for OAuth callbacks
   - Update app.json with OAuth schemes

2. **Update Mobile Auth**
   - Create mobile auth context with social methods
   - Wire up existing social buttons to actual OAuth flows
   - Implement mobile-specific error handling

3. **Mobile UI Enhancement**
   - Add provider icons (Google, Apple, Facebook)
   - Implement loading states for social buttons
   - Add accessibility labels and testing IDs

### Phase 4: Advanced Features
1. **Account Linking**
   - Detect existing accounts with same email
   - Prompt user for account linking confirmation
   - Merge user profiles and preferences

2. **Profile Synchronization**
   - Fetch profile data from OAuth providers
   - Update user profile with name, avatar, etc.
   - Handle profile picture syncing

3. **Security & Error Handling**
   - Implement PKCE for mobile OAuth flows
   - Add comprehensive error handling
   - Add security monitoring for OAuth flows

## 🔧 Technical Implementation Details

### Dependencies Needed
- **Web**: No new dependencies (Supabase already installed)
- **Mobile**: `expo-auth-session`, `expo-linking`, `expo-constants`

### Environment Variables
```bash
# Supabase Configuration (already exists)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# OAuth Provider Credentials (to be configured)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
```

### File Structure Changes
```
packages/
├── validation/src/auth.ts ✅ (already has OAuth schemas)
├── types/src/auth.ts ✅ (already has OAuth types)

apps/web/src/
├── providers/auth-provider.tsx 🔄 (add social methods)
├── features/auth/components/
│   ├── LoginForm.tsx 🔄 (add social buttons)
│   ├── SignupForm.tsx 🔄 (add social buttons)
│   ├── SocialLoginButton.tsx ➕ (new)
│   └── SocialLoginGroup.tsx ➕ (new)

apps/trip-sync-mobile/src/
├── lib/auth/index.tsx 🔄 (add social methods)
├── components/login-form.tsx 🔄 (wire up buttons)
├── components/register-form.tsx 🔄 (add social buttons)
└── app.json 🔄 (add OAuth schemes)
```

## 🧪 Testing Strategy

### Manual Testing
1. **OAuth Flow Testing**
   - Test each provider on web and mobile
   - Verify callback handling and session creation
   - Test account linking scenarios

2. **Cross-Platform Testing**
   - Ensure consistent UX between web and mobile
   - Test deep linking on mobile devices
   - Verify token handling and storage

### Automated Testing
1. **Unit Tests**
   - Auth provider methods
   - Social login components
   - OAuth callback handling

2. **Integration Tests**
   - End-to-end OAuth flows
   - Account linking scenarios
   - Profile synchronization

## 📚 AI Collaborator Insights

### Key Recommendations from OpenAI:
- Use Supabase's built-in OAuth handling for security
- Implement PKCE for mobile OAuth flows
- Handle account linking gracefully with user confirmation
- Respect privacy settings (especially Apple's email relay)

### Key Recommendations from Grok:
- Common pitfalls: Mismatched redirect URIs, Apple simulator issues
- Use Expo's proxy for development deep linking
- Implement exponential backoff for OAuth retries
- Store tokens securely using platform-specific storage

## 🚀 Implementation Order

1. ✅ **Analysis & Planning** (This document)
2. 🔄 **Create Feature Branch** (`feature/issue-22-social-login`)
3. ⏳ **Phase 1: Foundation Setup** (Auth provider methods)
4. ⏳ **Phase 2: Web Implementation** (UI components + integration)
5. ⏳ **Phase 3: Mobile Implementation** (AuthSession + UI wiring)
6. ⏳ **Phase 4: Advanced Features** (Account linking + profile sync)
7. ⏳ **Testing & QA** (Manual + automated testing)
8. ⏳ **Documentation & PR** (Update docs, create PR)

## 🎯 Success Criteria

- [ ] Google OAuth working on web and mobile
- [ ] Apple Sign-In working on web and mobile  
- [ ] Facebook OAuth working on web and mobile
- [ ] Account linking for existing users
- [ ] Profile data auto-population
- [ ] Consistent UI/UX across platforms
- [ ] Comprehensive error handling
- [ ] Security best practices implemented
- [ ] All tests passing

---

**Next Steps**: Create feature branch and begin Phase 1 implementation.
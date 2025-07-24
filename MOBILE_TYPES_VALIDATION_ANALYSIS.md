# Mobile App Types and Validation Analysis

## Overview
Analysis of type definitions and validation schemas currently used by the mobile app versus what's available in the monorepo shared packages.

## Current Mobile App Type Usage

### Mobile App Type Definitions

#### 1. API Types (`src/api/types.ts`)
```typescript
export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};
```

#### 2. Post Types (`src/api/posts/types.ts`)
```typescript
export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
```

#### 3. Main Types (`src/types/index.ts`)
- **Status**: Empty file (1 line)
- **Content**: No type definitions currently

### Mobile App Validation Schemas

#### 1. Login Form Validation (`src/components/login-form.tsx`)
```typescript
const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});
```

#### 2. Registration Form Validation (`src/components/register-form.tsx`)
```typescript
const schema = z
  .object({
    fullName: z
      .string({
        required_error: 'Full name is required',
      })
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Password must contain letters and numbers'
      ),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
```

#### 3. Add Post Form Validation (`src/app/feed/add-post.tsx`)
```typescript
const schema = z.object({
  title: z.string().min(10),
  body: z.string().min(120),
});
```

## Monorepo Shared Types Analysis

### Available Shared Types (`packages/types/src/`)

#### 1. Authentication Types (`auth.ts`)
- User types
- Session types  
- Authentication provider types
- Permission and role types

#### 2. API Types (`api.ts`)
- Request/response interfaces
- Error handling types
- Pagination types
- API metadata types

#### 3. Common Types (`common.ts`)
- Utility types
- Base interfaces
- Timestamp types
- ID types

#### 4. Domain-Specific Types
- `activity.ts` - Activity and event types
- `booking.ts` - Booking and reservation types
- `itinerary.ts` - Travel itinerary types
- `location.ts` - Location and geographic types
- `payment.ts` - Payment and transaction types
- `user.ts` - User profile and preference types

### Available Shared Validation (`packages/validation/src/`)

#### 1. Authentication Validation (`auth.ts`)
```typescript
// More robust login schema
export const LoginSchema = z.object({
  email: EmailSchema.transform(sanitizeEmail),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
  deviceId: z.string().optional(),
  deviceName: z.string().optional(),
});

// More comprehensive registration schema
export const RegisterSchema = z
  .object({
    email: EmailSchema.transform(sanitizeEmail),
    password: PasswordSchema, // Stronger password validation
    confirmPassword: z.string(),
    name: z.string().min(2).max(100),
    username: UsernameSchema.optional(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
    marketingConsent: z.boolean().default(false),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Advanced password validation
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters') // vs mobile's 6
  .max(100, 'Password must be less than 100 characters')
  .refine(isStrongPassword, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  });
```

#### 2. Common Validation (`common.ts`)
- Email validation with sanitization
- Phone number validation
- URL validation
- Date/time validation

#### 3. Domain-Specific Validation
- User profile validation
- Booking validation
- Payment validation
- Itinerary validation

## Comparison Analysis

### Type Definitions

#### Mobile vs Monorepo
| Aspect | Mobile App | Monorepo Shared |
|--------|------------|-----------------|
| **API Types** | Basic pagination only | Comprehensive API interfaces |
| **Auth Types** | None (forms only) | Complete auth system types |
| **Domain Types** | Post type only | Activity, booking, location, etc. |
| **Utility Types** | None | Common utilities and helpers |

#### Overlap Assessment
- ✅ **No Overlap**: Mobile uses completely independent types
- ✅ **No Dependencies**: Mobile doesn't import any `@sabron/types`
- ⚠️ **Potential Benefit**: Could leverage shared domain types for consistency

### Validation Schemas

#### Mobile vs Monorepo
| Schema Type | Mobile Implementation | Monorepo Implementation | Benefit of Shared |
|-------------|----------------------|------------------------|-------------------|
| **Login** | Basic email + password (6 char min) | Email sanitization + device tracking | ✅ Enhanced security |
| **Registration** | Basic validation + regex | Stronger password + username + marketing consent | ✅ More comprehensive |
| **Email** | Simple `.email()` | Sanitization + normalization | ✅ Data consistency |
| **Password** | 6 char + letter/number regex | 8 char + uppercase/lowercase/number/special | ✅ Better security |

#### Overlap Assessment
- ⚠️ **Divergent Standards**: Mobile has less strict validation
- ⚠️ **Inconsistent UX**: Different error messages between platforms
- ✅ **Potential Benefit**: Shared schemas would ensure consistency

## Separation Strategy Options

### Option 1: Complete Independence (Current State)
**Approach**: Keep mobile app's own type definitions and validation
**Pros**:
- ✅ Zero dependencies on monorepo
- ✅ Mobile-optimized validation rules
- ✅ No breaking changes during separation
- ✅ Faster development iteration

**Cons**:
- ⚠️ Potential inconsistency with backend/web
- ⚠️ Duplicate validation logic
- ⚠️ Different user experience standards

### Option 2: Selective Sharing
**Approach**: Share critical types via npm package, keep mobile-specific validation
**Pros**:
- ✅ Consistency for core domain objects
- ✅ Mobile retains validation autonomy
- ✅ Reduced type drift risk

**Cons**:
- ⚠️ Additional package maintenance
- ⚠️ Version synchronization complexity

### Option 3: Full Sharing
**Approach**: Use monorepo types and validation packages
**Pros**:
- ✅ Complete consistency across platforms
- ✅ Shared validation logic
- ✅ Better user experience alignment

**Cons**:
- ❌ Creates dependency on monorepo packages
- ❌ Mobile-specific optimizations harder
- ❌ Slower mobile development cycles

## Recommended Approach

### Phase 1: Independent Separation (Immediate)
1. **Keep current mobile types and validation**
2. **Document differences for future alignment**
3. **Proceed with clean separation**

**Rationale**: Mobile app works perfectly with current types/validation. No need to add complexity during separation.

### Phase 2: Gradual Alignment (Future)
1. **Create lightweight shared package** for core domain types
2. **Gradually align validation standards** where it makes sense
3. **Maintain mobile-specific optimizations** for UX

**Rationale**: Allow teams to work independently while building toward consistency.

## Migration Steps for Separation

### Immediate (Phase 1)
1. ✅ **No changes needed** - mobile types are already independent
2. ✅ **Document current schemas** for reference
3. ✅ **Note validation differences** for future review

### Future Optimization (Phase 2)
1. **Review mobile vs web UX requirements**
2. **Identify common domain objects** worth sharing
3. **Create shared package** if benefits outweigh costs
4. **Gradually migrate** mobile app to use shared types

## Current State Assessment

### Independence Score: 10/10
- ✅ **Zero shared dependencies**
- ✅ **Complete functional independence**  
- ✅ **No breaking changes needed**
- ✅ **Ready for immediate separation**

### Future Alignment Opportunities
- 🔄 **Authentication schemas** - Could benefit from sharing
- 🔄 **Domain object types** - Potential consistency gains
- 🔄 **API response types** - If backend changes

## Conclusion

**Current State**: Mobile app has complete type and validation independence.

**Recommendation**: Proceed with separation using current mobile types/validation. This is the lowest-risk path that maintains mobile team autonomy while keeping the door open for future selective sharing.

**Future Consideration**: After separation proves successful, evaluate selective sharing for authentication schemas and core domain types if consistency benefits outweigh the added complexity.
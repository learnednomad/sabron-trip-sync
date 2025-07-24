# Mobile App Environment Variables Documentation

## Overview
Documentation of environment variables required for standalone mobile app operation, including migration strategy from monorepo shared variables.

## Current Environment Architecture

### Monorepo Global Environment Variables
From `turbo.json` globalEnv affecting mobile:
```json
{
  "globalEnv": [
    "EXPO_PUBLIC_API_URL",
    "EXPO_PUBLIC_SENTRY_DSN", 
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY"
  ]
}
```

### Mobile App Environment Configuration
From `apps/trip-sync-mobile/env.js`:

#### Client Environment Variables (Exposed to App)
```javascript
const client = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  NAME: z.string(),
  SCHEME: z.string(),
  BUNDLE_ID: z.string(),
  PACKAGE: z.string(),
  VERSION: z.string(),
  
  // API Configuration
  API_URL: z.string(),
  
  // Authentication
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  
  // Example Variables
  VAR_NUMBER: z.number(),
  VAR_BOOL: z.boolean(),
});
```

#### Build-Time Environment Variables (Build Process Only)
```javascript
const buildTime = z.object({
  EXPO_ACCOUNT_OWNER: z.string(),
  EAS_PROJECT_ID: z.string(),
  SECRET_KEY: z.string(),
});
```

## Environment Variable Mapping

### Development Environment (.env.development)
```bash
# API Configuration
API_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000

# Authentication (Supabase)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Monitoring
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Build-Time Variables
SECRET_KEY=your_secret_key
EXPO_ACCOUNT_OWNER=your_expo_username
EAS_PROJECT_ID=c3e1075b-6fe7-4686-aa49-35b46a229044

# Example Variables
VAR_NUMBER=42
VAR_BOOL=true
```

### Staging Environment (.env.staging)
```bash
# API Configuration
API_URL=https://api-staging.yourdomain.com
EXPO_PUBLIC_API_URL=https://api-staging.yourdomain.com

# Authentication (Supabase - Staging Project)
SUPABASE_URL=your_staging_supabase_url
SUPABASE_ANON_KEY=your_staging_supabase_key

# Monitoring
EXPO_PUBLIC_SENTRY_DSN=your_staging_sentry_dsn

# Build-Time Variables
SECRET_KEY=your_staging_secret
EXPO_ACCOUNT_OWNER=your_expo_username
EAS_PROJECT_ID=c3e1075b-6fe7-4686-aa49-35b46a229044

# Example Variables
VAR_NUMBER=84
VAR_BOOL=false
```

### Production Environment (.env.production)
```bash
# API Configuration
API_URL=https://api.yourdomain.com
EXPO_PUBLIC_API_URL=https://api.yourdomain.com

# Authentication (Supabase - Production Project)
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_supabase_key

# Monitoring
EXPO_PUBLIC_SENTRY_DSN=your_production_sentry_dsn

# Build-Time Variables
SECRET_KEY=your_production_secret
EXPO_ACCOUNT_OWNER=your_expo_username
EAS_PROJECT_ID=c3e1075b-6fe7-4686-aa49-35b46a229044

# Example Variables
VAR_NUMBER=168
VAR_BOOL=true
```

## Separation Migration Strategy

### Step 1: Environment File Creation
Create environment files in standalone mobile repository:

```bash
# In new mobile repository root
touch .env.development
touch .env.staging  
touch .env.production
touch .env.local     # For local overrides (gitignored)
```

### Step 2: Variable Migration
Transfer current values from monorepo to mobile environment files:

#### From Monorepo Location
- Check current values in monorepo `.env` files
- Document any shared services (Supabase, Sentry)
- Note API URL configurations

#### To Mobile Repository
- Copy all required variables to appropriate env files
- Update API URLs if backend endpoints change
- Ensure all Zod schema requirements are met

### Step 3: Configuration Validation
Update `env.js` validation if needed:

```javascript
// Add any new environment variables to schemas
const client = z.object({
  // ... existing variables
  
  // Add new variables as needed
  NEW_VARIABLE: z.string().optional(),
});
```

## Shared Services Configuration

### Supabase Authentication
**Current Setup**: Shared Supabase project between web and mobile
**Migration Impact**: No change required - same project can serve both

```bash
# Same values for both web and mobile
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...your-anon-key
```

### API Backend
**Current Setup**: Mobile connects to same API as web app
**Migration Impact**: Ensure API URLs remain accessible

```bash
# Development
API_URL=http://localhost:3000  # Local development server

# Staging  
API_URL=https://api-staging.yourdomain.com

# Production
API_URL=https://api.yourdomain.com
```

### Sentry Monitoring
**Current Setup**: Shared Sentry project with platform-specific DSNs
**Migration Impact**: May need separate mobile Sentry project

```bash
# Option 1: Shared project with platform filtering
EXPO_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Option 2: Separate mobile project
EXPO_PUBLIC_SENTRY_DSN=https://mobile-dsn@sentry.io/mobile-project-id
```

## Environment Variable Security

### Public Variables (EXPO_PUBLIC_*)
These are embedded in the app bundle and visible to users:
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_SENTRY_DSN`

**Security Considerations**:
- Only expose necessary client-side variables
- API URLs are typically safe to expose
- Never expose secrets or private keys

### Private Variables
These are only available during build process:
- `SECRET_KEY`
- `EXPO_ACCOUNT_OWNER`
- `EAS_PROJECT_ID`

**Security Considerations**:
- Keep build-time secrets in CI/CD environment
- Never commit to version control
- Use environment-specific values

## Development Workflow

### Local Development Setup
```bash
# 1. Clone mobile repository
git clone <mobile-repo-url>
cd trip-sync-mobile

# 2. Copy environment template
cp .env.development.example .env.development

# 3. Update with local values
# Edit .env.development with your local configuration

# 4. Install dependencies
pnpm install

# 5. Start development server
pnpm start
```

### Environment Switching
```bash
# Development
APP_ENV=development pnpm start

# Staging
APP_ENV=staging pnpm build:staging:ios

# Production  
APP_ENV=production pnpm build:production:android
```

## CI/CD Environment Variables

### GitHub Actions Setup
Required secrets in mobile repository:

```yaml
# .github/workflows/build.yml
env:
  # Build-time variables
  EXPO_ACCOUNT_OWNER: ${{ secrets.EXPO_ACCOUNT_OWNER }}
  EAS_PROJECT_ID: ${{ secrets.EAS_PROJECT_ID }}
  SECRET_KEY: ${{ secrets.SECRET_KEY }}
  
  # Runtime variables
  API_URL: ${{ secrets.API_URL }}
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  EXPO_PUBLIC_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
```

### EAS Build Integration
Configure in `eas.json`:

```json
{
  "build": {
    "development": {
      "env": {
        "APP_ENV": "development"
      }
    },
    "staging": {
      "env": {
        "APP_ENV": "staging"
      }
    },
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

## Troubleshooting

### Common Issues

#### Environment Not Loading
**Problem**: Variables showing as undefined
**Solution**: 
1. Check file naming (`.env.development` not `.env.dev`)
2. Verify APP_ENV variable is set correctly
3. Restart development server with cache clear

#### Build Failures
**Problem**: Missing required environment variables
**Solution**:
1. Check Zod schema requirements in `env.js`
2. Verify all required variables are defined
3. Check environment file syntax

#### Type Errors
**Problem**: Environment variable type mismatches
**Solution**:
1. Update TypeScript declarations if needed
2. Check Zod schema type definitions
3. Verify variable casting in `env.js`

### Validation Commands
```bash
# Check environment loading
pnpm start --verbose

# Validate environment schema
node -e "console.log(require('./env.js').ClientEnv)"

# Check build configuration
pnpm expo config --type public
```

## Migration Checklist

### Pre-Separation
- [ ] Document current environment variables
- [ ] Identify shared vs mobile-specific variables
- [ ] Note all environment file locations
- [ ] Record current values for backup

### During Separation
- [ ] Create environment files in new repository
- [ ] Transfer variable values
- [ ] Update any changed configurations
- [ ] Test environment loading

### Post-Separation
- [ ] Verify all environments work (dev, staging, prod)
- [ ] Test CI/CD pipeline with new variables
- [ ] Update team documentation
- [ ] Remove mobile variables from monorepo

This documentation ensures a smooth transition of environment configuration during the mobile app separation process.
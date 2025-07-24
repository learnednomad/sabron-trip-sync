# Monorepo Workspace Configuration Analysis

## Current Workspace Configuration

### pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
  - 'services/*'
```

**Impact**: Mobile app is included via `apps/*` pattern, making it part of the workspace.

### Turbo.json Configuration
The mobile app appears in Turborepo configuration through:
- Global environment variables that apply to all workspace packages
- Build and development tasks that run across the workspace

### Mobile App Integration Analysis

#### Workspace Dependencies
✅ **CONFIRMED**: Mobile app has ZERO workspace dependencies
- No `@sabron/*` package references found
- No `workspace:*` protocol usage
- Completely independent dependency tree

#### Environment Variables
From `turbo.json` globalEnv that affect mobile:
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_SENTRY_DSN`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

#### Build Process Integration
- Mobile app participates in workspace via `apps/*` pattern
- Inherits global Turborepo tasks
- Uses workspace pnpm lockfile

## Separation Impact Assessment

### Files to Update After Separation

#### 1. pnpm-workspace.yaml
**Current**:
```yaml
packages:
  - 'apps/*'  # Includes mobile app
  - 'packages/*'
  - 'tools/*'
  - 'services/*'
```

**Options After Separation**:

**Option A**: Keep `apps/*` (if other apps exist)
```yaml
packages:
  - 'apps/*'  # Will only include web app
  - 'packages/*'
  - 'tools/*'
  - 'services/*'
```

**Option B**: Be explicit (recommended)
```yaml
packages:
  - 'apps/web'  # Explicit web app only
  - 'packages/*'
  - 'tools/*'
  - 'services/*'
```

#### 2. Root package.json
- Remove any mobile-specific scripts (if any)
- Update workspace dependencies list

#### 3. turbo.json
- Remove mobile-specific environment variables:
  - `EXPO_PUBLIC_API_URL`
  - `EXPO_PUBLIC_SENTRY_DSN`
- Keep Supabase variables (shared with web)

#### 4. Documentation Updates
- CLAUDE.md - Remove mobile development section
- README files - Update architecture descriptions
- Development documentation - Remove mobile setup instructions

### What Remains in Monorepo

#### Apps Directory
```
apps/
├── web/              # Next.js web application
└── [mobile removed]
```

#### Shared Packages (Unchanged)
```
packages/
├── api-client/       # Web-specific API client
├── database/         # Shared database layer
├── i18n/            # Internationalization
├── types/           # Shared types
├── ui/              # Web UI components
└── validation/      # Shared validation schemas
```

## Migration Steps for Workspace

### Phase 1: Pre-Separation
1. Document current workspace configuration
2. Identify all references to mobile app in workspace files
3. Create list of configuration updates needed

### Phase 2: Post-Mobile Extraction
1. Update `pnpm-workspace.yaml` to exclude mobile
2. Remove mobile-specific environment variables from `turbo.json`
3. Clean up root package.json
4. Update documentation

### Phase 3: Workspace Optimization
1. Re-run `pnpm install` to update lockfile
2. Verify all workspace commands still work
3. Test build, dev, and test commands
4. Update CI/CD to exclude mobile paths

## Risk Assessment

### Low Risk
- Mobile app has no workspace dependencies
- Removal won't break existing packages
- Clear separation boundaries

### Medium Risk
- Shared environment variables (need careful handling)
- Documentation updates across multiple files
- Team workflow adjustments

### No Risk
- Breaking changes to existing packages
- Complex dependency resolution
- Build system failures

## Recommended Approach

### Immediate Actions
1. **Keep `apps/*` pattern initially** - safer during transition
2. **Gradual environment variable cleanup** - remove mobile-specific vars only
3. **Document all changes** - maintain rollback capability

### Future Optimization
1. **Switch to explicit app paths** once mobile separation is confirmed stable
2. **Clean up unused dependencies** in root package.json
3. **Optimize workspace commands** for web-focused development

## Conclusion

The workspace configuration impact is minimal due to:
- ✅ Zero dependency coupling
- ✅ Clean separation boundaries  
- ✅ Independent mobile app architecture
- ✅ Straightforward configuration updates

**Recommended Separation Method**: Clean extraction with minimal workspace disruption.
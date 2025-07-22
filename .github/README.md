# CI/CD Pipeline Documentation

## Overview

This repository uses a modernized CI/CD pipeline designed for a TypeScript monorepo containing:
- React/Next.js web application (`apps/web`)
- React Native mobile application (`trip-sync-mobile/`)
- Shared packages and services

## Pipeline Architecture

### Phase 1: Monorepo Optimization (Current)

Our current implementation focuses on:
- **Intelligent Caching**: Using Turborepo with GitHub Actions cache
- **Parallel Execution**: Matrix strategies for concurrent job execution
- **Affected Builds**: Only building/testing changed packages
- **Optimized Dependencies**: Efficient pnpm store caching

### Workflows

#### Main Workflows

1. **`ci-optimized.yml`** - Main CI pipeline with intelligent change detection
2. **`ci.yml`** - Legacy pipeline (will be deprecated after Phase 1 validation)
3. **`quality-gates.yml`** - Quality checks and security scans

#### Reusable Workflows

1. **`detect-changes.yml`** - Intelligent change detection using Turborepo
2. **`setup-node.yml`** - Standardized Node.js environment setup

### Key Features

#### Intelligent Change Detection

The pipeline automatically detects which packages are affected by changes:

```yaml
# Automatically determines affected packages
affected-packages: web,@sabron/api-client,@sabron/types
has-web-changes: true
has-mobile-changes: false  
has-api-changes: true
```

#### Parallel Matrix Execution

Jobs run in parallel based on workspace and task type:

```yaml
strategy:
  matrix:
    task: [lint, typecheck]
    workspace: [monorepo, mobile]
```

#### Advanced Caching Strategy

Multiple cache layers for optimal performance:

1. **pnpm Store Cache**: Shared dependencies across runs
2. **Turborepo Cache**: Task outputs and build artifacts
3. **Next.js Build Cache**: Framework-specific optimizations

### Environment Variables

#### Required Secrets

- `TURBO_TOKEN`: Turborepo remote caching token (optional)
- `TURBO_TEAM`: Turborepo team ID (optional)
- `EXPO_TOKEN`: Expo authentication token
- `CODECOV_TOKEN`: Code coverage reporting
- `COOLIFY_TOKEN`: Deployment automation

#### Turborepo Configuration

The `turbo.json` file defines:
- Task dependencies and caching strategies
- Environment variable propagation
- Output file patterns
- Remote caching settings

### Performance Improvements

#### Before (Legacy Pipeline)
- Sequential execution: ~15-20 minutes
- Full rebuilds on any change
- No intelligent caching
- Redundant dependency installation

#### After (Optimized Pipeline)
- Parallel execution: ~5-8 minutes (estimated 60-70% reduction)
- Affected-only builds
- Multi-layer caching
- Optimized dependency management

### Triggering Builds

#### Pull Requests
```bash
# Only affected packages are built/tested
git push origin feature/my-changes
```

#### Main Branch
```bash
# All packages are built/tested/deployed
git push origin main
```

#### Manual Trigger
```bash
# Using GitHub CLI
gh workflow run ci-optimized.yml
```

### Monitoring and Debugging

#### Viewing Affected Packages

The pipeline outputs affected packages for debugging:

```bash
# In GitHub Actions logs
Affected packages: web,@sabron/api-client,@sabron/types
Final affected packages: web,@sabron/api-client,@sabron/types
```

#### Cache Performance

Monitor cache hit rates in job logs:

```bash
Cache restored from key: Linux-turbo-build-web-abc123
Cache saved with key: Linux-turbo-build-web-def456
```

### Future Enhancements (Upcoming Phases)

#### Phase 2: Security & Quality Gates (Weeks 4-6)
- Dependabot integration
- Snyk vulnerability scanning
- SonarCloud code quality
- Enhanced test coverage reporting

#### Phase 3: Advanced Deployment (Weeks 7-9)
- Blue-green deployments
- Canary releases
- Automated rollbacks
- Environment-specific workflows

#### Phase 4: Comprehensive Testing (Weeks 10-12)
- E2E testing with Cypress/Playwright
- Mobile E2E with Detox
- Performance testing
- Visual regression testing

## Troubleshooting

### Common Issues

#### "No affected packages detected"
```bash
# Check if base branch reference is correct
git fetch origin main
git diff --name-only origin/main...HEAD
```

#### Cache misses
```bash
# Verify turbo.json configuration
pnpm turbo run build --dry=json
```

#### Mobile build failures
```bash
# Check Expo token configuration
echo $EXPO_TOKEN | wc -c  # Should be > 0
```

### Debug Commands

```bash
# Local testing of affected packages
pnpm turbo run build --filter="...[main]" --dry=json

# Cache inspection
pnpm turbo run build --summarize

# Dependency graph
pnpm turbo run build --graph
```

## Development Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Run affected builds
pnpm turbo run build --filter="...[main]"

# Run all quality checks
pnpm run check
```

### Pre-commit Checks

The pipeline enforces these checks:
1. ESLint with auto-fix
2. TypeScript compilation
3. Unit test execution
4. Build verification

### Branch Protection

Main branch requires:
- ✅ All CI checks passing
- ✅ Up-to-date with base branch
- ✅ At least one approval (recommended)

## Migration Guide

### From Legacy Pipeline

1. **Test Period**: Both pipelines run in parallel
2. **Validation**: Compare performance and reliability
3. **Switch**: Update branch protection rules
4. **Cleanup**: Remove legacy workflows

### Environment Setup

1. Add required secrets to repository settings
2. Configure Turborepo remote caching (optional)
3. Update branch protection rules
4. Train team on new workflows

## Performance Metrics

### Target Improvements (Phase 1)
- ⚡ 60-70% reduction in CI time
- 💰 50% reduction in GitHub Actions minutes
- 🚀 Faster developer feedback loops
- 🔄 Improved cache hit rates (>80%)

### Success Criteria
- Zero pipeline downtime during migration
- Maintained or improved reliability
- Developer satisfaction >90%
- Performance targets achieved

## Support

For issues or questions:
1. Check this documentation
2. Review GitHub Actions logs
3. Test locally with Turborepo commands
4. Create issue with pipeline logs
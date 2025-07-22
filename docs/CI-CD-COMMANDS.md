# CI/CD Pipeline Commands Reference

This document provides organized commands for managing the CI/CD pipeline implementation across all phases.

## Phase 1: Monorepo Optimization Commands

### Development Commands
```bash
# Start all services in development
pnpm dev

# Start individual services
cd apps/web && pnpm dev          # Web app on http://localhost:3001
cd services/api && pnpm dev      # API on http://localhost:3000

# Build all packages
pnpm build

# Run tests with coverage
pnpm test:ci

# Quality checks
pnpm lint                        # Lint all files
pnpm typecheck                   # Type check all TypeScript
pnpm check                       # Run lint, typecheck, and test together
```

### Turborepo Commands
```bash
# Run commands with Turbo (optimized caching)
pnpm turbo run build             # Build all packages
pnpm turbo run test              # Test all packages
pnpm turbo run lint              # Lint all packages

# Filter specific packages
pnpm turbo run build --filter=@sabron/ui
pnpm turbo run test --filter='{apps/web}'

# Dry run to see what would execute
pnpm turbo run build --dry-run

# Clear Turbo cache
pnpm turbo prune
```

### Database Commands
```bash
# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio

# Generate TypeScript types from Supabase
pnpm db:types:generate
```

## Phase 2: Security & Quality Commands

### Security Scanning Commands
```bash
# Run security audit
pnpm audit --audit-level moderate

# Check for outdated dependencies
pnpm outdated

# Update dependencies (use with caution)
pnpm update --interactive

# Run ESLint security rules
pnpm lint --fix

# Check for secrets in code
git secrets --scan
```

### GitHub Workflow Commands
```bash
# Trigger workflows manually
gh workflow run ci-optimized.yml
gh workflow run security.yml
gh workflow run setup-branch-protection.yml

# Check workflow status
gh workflow list
gh run list --workflow=ci-optimized.yml

# View workflow logs
gh run view <run-id> --log

# Download workflow artifacts
gh run download <run-id>
```

### Quality Gate Commands
```bash
# Run all quality checks locally
pnpm quality-check

# Check coverage thresholds
pnpm test:ci --coverage

# Run SonarCloud analysis (if configured locally)
sonar-scanner

# Validate branch protection rules
gh api repos/:owner/:repo/branches/main/protection
```

## Phase 3: Deployment Commands (Planned)

### Infrastructure Commands
```bash
# Terraform operations
terraform plan -var-file="environments/prod.tfvars"
terraform apply -var-file="environments/prod.tfvars"
terraform destroy -var-file="environments/prod.tfvars"

# Pulumi operations (alternative)
pulumi stack select production
pulumi up
pulumi destroy

# Docker operations
docker build -f Dockerfile.production -t sabron-trip-sync .
docker-compose -f docker-compose.prod.yml up -d
```

### Deployment Commands
```bash
# Blue-green deployment
gh workflow run deploy-blue-green.yml -f environment=production

# Canary deployment
gh workflow run deploy-canary.yml -f traffic_percentage=25

# Production deployment with gates
gh workflow run deploy-production.yml -f version=v1.2.3

# Rollback deployment
gh workflow run rollback-automated.yml -f target_version=v1.2.2
```

### Monitoring Commands
```bash
# Check deployment health
kubectl get pods -n sabron-production
kubectl logs -f deployment/sabron-web -n sabron-production

# Prometheus queries (examples)
curl "http://prometheus:9090/api/v1/query?query=up"
curl "http://prometheus:9090/api/v1/query?query=http_requests_total"

# Grafana dashboard management
curl -X POST http://admin:password@grafana:3000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @dashboard.json
```

## Git Workflow Commands

### Branch Management
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Keep branch updated with main
git fetch origin
git rebase origin/main

# Clean merge to main
git checkout main
git pull origin main
git merge --no-ff feature/your-feature-name
```

### Commit Best Practices
```bash
# Stage specific files
git add .github/workflows/
git add docs/
git add packages/

# Commit with conventional format
git commit -m "feat: add new CI/CD feature

Detailed description of the changes made.

- Added new workflow for deployment
- Enhanced security scanning
- Updated documentation

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push origin feature/your-feature-name
```

### Pull Request Commands
```bash
# Create pull request
gh pr create --title "feat: implement feature" \
  --body "Description of changes" \
  --reviewer @username

# Check PR status
gh pr status

# Merge PR (after approval)
gh pr merge --squash --delete-branch

# View PR checks
gh pr checks
```

## Environment Management Commands

### Local Development
```bash
# Install all dependencies
pnpm install --frozen-lockfile

# Clean install (if issues)
pnpm reset                       # Custom script to clean all node_modules
pnpm install --frozen-lockfile

# Update lockfile
pnpm install --lockfile-only

# Approve build scripts (security)
pnpm approve-builds @prisma/client esbuild
```

### Environment Variables
```bash
# Copy environment template
cp .env.example .env.local

# Validate environment variables
pnpm validate-env

# Load environment for testing
export $(cat .env.test | xargs)
```

### Docker Development
```bash
# Build development containers
pnpm docker:build

# Start services with Docker
pnpm docker:up

# Stop Docker services
pnpm docker:down

# View logs
docker-compose logs -f web
docker-compose logs -f api
```

## Troubleshooting Commands

### Common Issues
```bash
# Clear all caches
pnpm reset
rm -rf node_modules
rm -rf .turbo
rm -rf apps/web/.next
pnpm install --frozen-lockfile

# Fix TypeScript issues
pnpm db:generate                 # Regenerate Prisma client
pnpm typecheck                   # Check for type errors

# Fix ESLint issues
pnpm lint --fix

# Check for circular dependencies
pnpm madge --circular packages/*/src

# Analyze bundle size
pnpm build
pnpm analyze                     # If script exists
```

### Debug Workflows
```bash
# Debug failing workflow
gh run view <run-id> --log
gh run rerun <run-id>

# Check workflow file syntax
gh workflow view ci-optimized.yml

# Test workflow locally (if act is installed)
act -j test                      # Run test job locally
```

### Performance Analysis
```bash
# Analyze Turbo performance
pnpm turbo run build --summarize
pnpm turbo run build --profile

# Check bundle sizes
pnpm build
find apps/web/.next/static -name "*.js" -exec wc -c {} +

# Profile application
pnpm start --profile
```

## Useful Aliases (Add to your shell config)

```bash
# Add these to your ~/.zshrc or ~/.bashrc

# Turbo shortcuts
alias tb='pnpm turbo run build'
alias tt='pnpm turbo run test'
alias tl='pnpm turbo run lint'
alias tc='pnpm turbo run typecheck'

# Git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline -10'

# Development shortcuts
alias dev='pnpm dev'
alias build='pnpm build'
alias test='pnpm test'
alias lint='pnpm lint --fix'

# GitHub CLI shortcuts
alias ghpr='gh pr create'
alias ghst='gh pr status'
alias ghwf='gh workflow list'
```

## Command Templates

### Creating New Workflow
```bash
# Template for new GitHub workflow
cat > .github/workflows/new-workflow.yml << 'EOF'
name: New Workflow

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  example-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22.17.0'
      - name: Install pnpm
        run: corepack enable && corepack prepare pnpm@10.12.3 --activate
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Run task
        run: pnpm your-command
EOF
```

### Adding New Package
```bash
# Create new package in monorepo
mkdir -p packages/new-package
cd packages/new-package

# Initialize package.json
cat > package.json << 'EOF'
{
  "name": "@sabron/new-package",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
EOF

# Add to workspace dependencies where needed
pnpm add @sabron/new-package --filter @sabron/app
```

This command reference provides organized, sanitized commands for all phases of your CI/CD pipeline implementation. Each section is focused on specific use cases with clear examples and best practices.
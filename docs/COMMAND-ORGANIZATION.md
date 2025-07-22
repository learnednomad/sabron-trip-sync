# Command Organization & Sanitization

## Overview

This document outlines the organized command structure for the Sabron Trip Sync project, providing clear separation of concerns and sanitized command references for all development phases.

## Directory Structure

```
sabron-trip-sync/
├── scripts/                    # Executable automation scripts
│   ├── ci-cd-setup.sh         # CI/CD pipeline setup automation
│   ├── git-helpers.sh         # Git workflow automation
│   ├── setup-aliases.sh       # Development productivity aliases
│   ├── setup-github-project.js # GitHub project structure setup
│   └── README.md              # Scripts documentation
├── docs/                       # Documentation and references
│   ├── CI-CD-COMMANDS.md      # Complete command reference by phase
│   ├── CI-CD-PHASE-*          # Phase-specific implementation guides
│   └── WORKFLOW-ANALYSIS-FIXES.md # Workflow fixes documentation
└── tools/                     # Shared tooling configurations
    ├── eslint-config/         # ESLint rule configurations
    ├── typescript-config/     # TypeScript compiler configurations
    └── generators/            # Code generation tools
```

## Command Categories

### 1. 🚀 Development Workflow Commands
**Location**: `docs/CI-CD-COMMANDS.md` → "Phase 1: Monorepo Optimization Commands"

Primary development commands for daily use:
- `pnpm dev` - Start all services
- `pnpm build` - Build all packages
- `pnpm test:ci` - Run tests with coverage
- `pnpm lint`, `pnpm typecheck` - Quality checks

### 2. 🔧 Infrastructure Automation Scripts
**Location**: `scripts/` directory

Executable scripts for setup and automation:
- `./scripts/ci-cd-setup.sh` - Complete CI/CD setup
- `./scripts/git-helpers.sh` - Git workflow automation
- `source scripts/setup-aliases.sh` - Install productivity aliases

### 3. 🛡️ Security & Quality Commands
**Location**: `docs/CI-CD-COMMANDS.md` → "Phase 2: Security & Quality Commands"

Security scanning and quality assurance:
- `pnpm audit --audit-level moderate` - Security audit
- `gh workflow run security.yml` - Trigger security workflows
- `pnpm quality-check` - Complete quality gate check

### 4. 🚢 Deployment Commands (Planned)
**Location**: `docs/CI-CD-COMMANDS.md` → "Phase 3: Deployment Commands"

Production deployment and infrastructure:
- Blue-green deployment workflows
- Infrastructure as Code (Terraform/Pulumi)
- Monitoring and observability commands

### 5. 🔄 Git Workflow Commands
**Location**: `docs/CI-CD-COMMANDS.md` → "Git Workflow Commands"

Version control and collaboration:
- Branch management best practices
- Conventional commit formatting
- Pull request automation

## Sanitization Principles

### ✅ Sanitized Command Characteristics

1. **Environment Agnostic**: Commands work across development environments
2. **Error Handling**: Proper error checking and informative messages
3. **Security Conscious**: No hardcoded secrets or sensitive data
4. **Documented Purpose**: Clear description of what each command does
5. **Version Pinned**: Specific versions for reproducible builds

### ✅ Command Safety Features

- **Dry-run Options**: Preview capabilities where applicable
- **Confirmation Prompts**: Interactive confirmation for destructive operations
- **Fallback Mechanisms**: Graceful degradation when tools aren't available
- **Logging**: Comprehensive logging for troubleshooting

### ✅ Organization Benefits

- **Discoverability**: Easy to find relevant commands
- **Maintainability**: Single source of truth for command references
- **Consistency**: Standardized patterns across all scripts
- **Documentation**: Each command has clear purpose and usage examples

## Quick Access Guide

### For Daily Development
```bash
# Essential aliases (run once)
source scripts/setup-aliases.sh

# Quick development workflow
dev          # Start all services (alias for pnpm dev)
tb           # Build all (alias for pnpm turbo run build)
tt           # Test all (alias for pnpm turbo run test)
lint         # Fix linting issues (alias for pnpm lint --fix)
```

### For Project Setup
```bash
# Complete project setup
./scripts/ci-cd-setup.sh

# GitHub project structure
cd scripts && npm install && node setup-github-project.js
```

### For CI/CD Management
```bash
# Check workflow status
gh workflow list
gh run list --workflow=ci-optimized.yml

# Trigger specific workflows
gh workflow run security.yml
gh workflow run ci-optimized.yml
```

### For Git Workflow
```bash
# Smart commit with conventional format
./scripts/git-helpers.sh commit "feat: implement feature"

# Feature branch workflow
git checkout -b feature/new-feature
# ... make changes ...
./scripts/git-helpers.sh commit "feat: add new feature"
gh pr create --title "feat: implement new feature"
```

## Command Reference Links

- **Complete Commands**: [`docs/CI-CD-COMMANDS.md`](./CI-CD-COMMANDS.md)
- **Scripts Documentation**: [`scripts/README.md`](../scripts/README.md)
- **Phase Implementation**: [`docs/CI-CD-PHASE-*`](./CI-CD-PHASE-2-IMPLEMENTATION.md)
- **Workflow Analysis**: [`docs/WORKFLOW-ANALYSIS-FIXES.md`](./WORKFLOW-ANALYSIS-FIXES.md)

## Best Practices

### Command Usage
1. **Always use pnpm** instead of npm/yarn for consistency
2. **Leverage Turborepo** for optimized build/test execution
3. **Use aliases** for frequently used commands
4. **Check workflow status** before triggering new runs

### Script Execution  
1. **Make scripts executable**: `chmod +x scripts/*.sh`
2. **Review scripts** before running in production
3. **Use dry-run options** when available
4. **Check prerequisites** before running setup scripts

### Documentation
1. **Update commands** when adding new functionality
2. **Document environment requirements** for new commands
3. **Include examples** for complex command usage
4. **Link related documentation** for context

This organization provides a clean, maintainable structure for all project commands while ensuring security, clarity, and ease of use across the development lifecycle.
# Sabron Trip Sync - Development Scripts & Commands

This directory contains organized automation scripts and command references for the Sabron Trip Sync project infrastructure and CI/CD pipeline management.

## 📋 Available Scripts

### 🚀 GitHub Project Setup (`setup-github-project.js`)

The `setup-github-project.js` script automates the creation of GitHub project structure including:

- **60+ Labels** for issue organization (features, platforms, priorities, phases)
- **4 Milestones** for our development phases (Foundation, Core, Advanced, Polish)
- **6 Epic Issues** for major feature areas
- **4 Initial Tasks** ready for Sprint 1

### 🔧 CI/CD Pipeline Setup (`ci-cd-setup.sh`)

Comprehensive CI/CD pipeline setup automation with:
- Prerequisites validation (Node.js, pnpm, git)
- Development environment setup
- GitHub workflows validation  
- Quality gate configuration
- Branch protection setup

### 🔀 Git Workflow Helpers (`git-helpers.sh`)

Smart git workflow automation including:
- Conventional commit formatting
- Feature branch creation and management
- Pull request automation
- Repository management utilities

### ⚡ Development Aliases (`setup-aliases.sh`)

Productivity aliases for common development tasks:
- Turborepo shortcuts (tb, tt, tl, tc)
- Git shortcuts (gs, ga, gc, gp, gl)
- Development workflow shortcuts

## 🎯 Quick Start Commands

```bash
# Set up entire development environment
./scripts/ci-cd-setup.sh

# Configure GitHub project structure
cd scripts && npm install && node setup-github-project.js

# Install productivity aliases
source scripts/setup-aliases.sh

# Smart commit with conventional format
./scripts/git-helpers.sh commit "feat: your feature description"
```

## 📖 Command References

See [`../docs/CI-CD-COMMANDS.md`](../docs/CI-CD-COMMANDS.md) for complete command reference organized by development phase.

### Features Aligned with Development Plan

- **Phase-based Labels**: `phase:1-foundation`, `phase:2-core`, `phase:3-advanced`, `phase:4-polish`
- **Feature Areas**: `feature:auth`, `feature:itinerary`, `feature:visa`, `feature:cultural`, etc.
- **Platforms**: `platform:mobile`, `platform:web`, `platform:api`, `platform:db`, `platform:coolify`
- **Functional Requirements**: Issues mapped to FR-001 through FR-084
- **Non-Functional Requirements**: Labels for performance, security, accessibility, scalability

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **GitHub Personal Access Token** with the following scopes:
   - `repo` (full repository access)
   - `write:packages` (for package management)
   - `read:packages` (for package access)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd scripts
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your GitHub token
# Get token from: https://github.com/settings/tokens
```

### 3. Run Setup Script

```bash
# Interactive setup
npm run setup-github

# Or run directly
node setup-github-project.js
```

### 4. Follow Prompts

The script will ask for:
- GitHub username or organization
- Repository name (default: sabron-trip-sync)
- Confirmation before creating items

## 📊 What Gets Created

### Labels (60+ labels organized by category)

**Feature Areas:**
- `feature:auth` - Authentication & user management
- `feature:itinerary` - Trip planning & itinerary management
- `feature:visa` - Visa requirements & documentation
- `feature:cultural` - Cultural information & local insights
- `feature:expense` - Financial management & expense tracking
- `feature:social` - Social features & communication
- `feature:maps` - Maps & navigation
- `feature:booking` - Booking integrations
- `feature:safety` - Safety features & emergency support
- `feature:offline` - Offline functionality
- `feature:ar` - Augmented reality features
- `feature:analytics` - Analytics dashboard

**Platforms:**
- `platform:mobile` - React Native/Expo mobile app
- `platform:web` - Next.js web dashboard
- `platform:api` - Hono API backend
- `platform:db` - Prisma/PostgreSQL database
- `platform:coolify` - Coolify deployment

**Development Phases:**
- `phase:1-foundation` - Months 1-3
- `phase:2-core` - Months 4-6
- `phase:3-advanced` - Months 7-9
- `phase:4-polish` - Months 10-12

**Priorities & Workflow:**
- `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
- `sprint:ready`, `blocked`, `help-wanted`, `good-first-issue`

**Non-Functional Requirements:**
- `nfr:performance`, `nfr:security`, `nfr:accessibility`, `nfr:usability`, `nfr:scalability`

### Milestones (4 development phases)

1. **Phase 1: Foundation (Months 1-3)**
   - Core infrastructure setup
   - Authentication system
   - Basic trip CRUD operations
   - Database schema implementation

2. **Phase 2: Core Features (Months 4-6)**
   - Real-time collaboration
   - Visa requirements system
   - Expense tracking
   - Offline functionality

3. **Phase 3: Advanced Features (Months 7-9)**
   - AR navigation
   - Booking integrations
   - Social features
   - Analytics dashboard

4. **Phase 4: Polish & Scale (Months 10-12)**
   - Performance optimization
   - Security hardening
   - Beta testing
   - Launch preparation

### Epic Issues (6 major feature areas)

1. **User Authentication & Profile Management**
   - FR-001 to FR-006 implementation
   - Social login integration
   - Profile management system

2. **Trip Planning & Itinerary Management**
   - FR-010 to FR-016 implementation
   - Real-time collaboration
   - Drag-and-drop itinerary builder

3. **Visa Requirements & Documentation System**
   - FR-020 to FR-024 implementation
   - Multi-country visa database
   - Document management

4. **Cultural Information & Local Insights**
   - FR-030 to FR-034 implementation
   - User-generated content
   - Multi-language support

5. **Financial Management & Expense Tracking**
   - FR-040 to FR-045 implementation
   - Group expense splitting
   - Receipt scanning

6. **Maps, Navigation & AR Features**
   - FR-060 to FR-064 implementation
   - AR navigation overlay
   - Offline maps

### Initial Tasks (4 sprint-ready tasks)

1. **Set up monorepo with Turborepo**
2. **Configure Supabase authentication system**
3. **Implement authentication screens (Mobile)**
4. **Create Prisma database schema**

## 🎯 After Setup

Once the script completes, you can:

1. **View Issues**: Visit your GitHub repository to see all created issues
2. **Set up Project Board**: Link milestones to your project board
3. **Start Development**: Begin with Phase 1 foundation tasks
4. **Use GitHub CLI**: Run `gh issue list --label "phase:1-foundation"` to see Phase 1 tasks

## 📚 Related Documentation

- [Development Plan](../development-plan.md) - Complete 12-month implementation roadmap
- [Requirements](../travelsync-requirements.md) - Detailed project requirements
- [CLAUDE.md](../CLAUDE.md) - Development guidelines and commands

## 🔧 Troubleshooting

### Common Issues

**Authentication Error:**
```
Error: Bad credentials
```
- Verify your GitHub token is correct
- Ensure token has required scopes (repo, write:packages, read:packages)

**Repository Not Found:**
```
Error: Not Found
```
- Check repository name spelling
- Verify you have write access to the repository
- Ensure the repository exists

**Rate Limiting:**
```
Error: API rate limit exceeded
```
- Wait for rate limit reset (usually 1 hour)
- Use a token with higher rate limits

### Getting Help

1. Check the GitHub token scopes at: https://github.com/settings/tokens
2. Verify repository permissions
3. Review the development plan for context
4. Check existing issues to avoid duplicates

## 🎉 Success Metrics

After successful setup:
- ✅ 60+ labels created and organized
- ✅ 4 milestones with proper timelines
- ✅ 6 epic issues with detailed requirements
- ✅ 4 initial tasks ready for development
- ✅ Project structure aligns with development plan
- ✅ All functional requirements mapped to issues
- ✅ CI/CD pipeline optimized and secured
- ✅ Development productivity enhanced with aliases
- ✅ Git workflow automation in place
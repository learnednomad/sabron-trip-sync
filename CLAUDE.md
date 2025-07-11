# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Commands

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.

### Development
- `pnpm dev` - Start all services (web, mobile, api) in development mode
- `pnpm build` - Build all packages and applications
- `pnpm test` - Run tests across all packages
- `pnpm test:ci` - Run tests with coverage for CI/CD
- `pnpm lint` - Lint all TypeScript/JavaScript files
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm typecheck` - Type check all TypeScript files

### Database
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations in development
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio for database management

### Individual App Commands
- **Mobile**: `cd apps/mobile && pnpm start` - Start Expo development server
- **Web**: `cd apps/web && pnpm dev` - Start Next.js on http://localhost:3001
- **API**: `cd services/api && pnpm dev` - Start Hono API on http://localhost:3000

### Docker
- `pnpm docker:build` - Build Docker containers
- `pnpm docker:up` - Start services with Docker Compose
- `pnpm docker:down` - Stop Docker containers

## Architecture Overview

### Monorepo Structure
This is a pnpm workspace monorepo using Turborepo for task orchestration:

**Apps:**
- `apps/web/` - Next.js 14 web dashboard with TypeScript, Tailwind CSS, shadcn/ui
- `apps/mobile/` - React Native app with Expo SDK 53, Expo Router, NativeWind

**Services:**
- `services/api/` - Hono backend API with Prisma, PostgreSQL, Redis, MongoDB, Supabase

**Shared Packages:**
- `packages/types/` - Shared TypeScript type definitions
- `packages/validation/` - Zod schemas for data validation
- `packages/ui/` - Shared UI components based on shadcn/ui
- `packages/database/` - Prisma schema and database utilities
- `packages/api-client/` - Type-safe API client with React Query hooks
- `packages/i18n/` - Internationalization setup with i18next

**Tools:**
- `tools/eslint-config/` - Shared ESLint configurations
- `tools/typescript-config/` - Shared TypeScript configurations

### Key Technologies
- **Framework**: React 19, Next.js 14, React Native 0.79.4, Expo SDK 53
- **Backend**: Hono, Prisma ORM, PostgreSQL, Redis, MongoDB, Supabase Auth
- **Styling**: Tailwind CSS, NativeWind, shadcn/ui components
- **State Management**: Zustand, React Query/TanStack Query
- **Validation**: Zod schemas
- **Testing**: Jest (mobile), Vitest (web/packages), React Testing Library
- **Deployment**: Docker, Coolify
- **Monitoring**: Sentry integration

### Data Flow Architecture
1. **API Layer** (`services/api/`): Hono server with OpenAPI documentation at `/docs`
2. **Client Layer** (`packages/api-client/`): Type-safe API client using React Query
3. **Validation Layer** (`packages/validation/`): Zod schemas shared between client and server
4. **UI Layer** (`packages/ui/`): Reusable components with consistent design system
5. **App Layer** (`apps/`): Platform-specific implementations consuming shared packages

### Development Environment Requirements
- Node.js ≥22.17.0
- pnpm 10.12.3 (managed via `packageManager` field)
- PostgreSQL, Redis, MongoDB for full backend functionality
- Expo CLI for mobile development

### Mobile Development Guidelines
Follow the Cursor rules in `apps/mobile/.cursorrules`:
- Use TypeScript with explicit types, avoid interfaces/enums
- Functional components with descriptive variable names (isLoading, hasError)
- Component modularity: max 80 lines per component
- NativeWind for styling with predefined colors/fonts
- Absolute imports with `@/` prefix
- Named exports, kebab-case file names
- Install packages with `npx expo install <package>`

### Testing Strategy
- **Mobile**: Jest with React Native Testing Library
- **Web**: Vitest with React Testing Library
- **API**: Custom test setup (check `services/api/` for specifics)
- **UI Components**: Both unit tests and Storybook stories

### Environment Variables
Key environment variables defined in `turbo.json`:
- Database: `DATABASE_URL`, `REDIS_URL`, `MONGODB_URI`
- Auth: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`
- Frontend: `NEXT_PUBLIC_API_URL`, `EXPO_PUBLIC_API_URL`
- Monitoring: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_SENTRY_DSN`

### Workspace Dependencies
Apps and packages reference each other using `workspace:*` protocol. Always check package.json files to understand the dependency graph before making changes that might affect multiple packages.

## Development Best Practices

### Code Standards
- Use conventional commits (feat:, fix:, docs:, etc.)
- Run `pnpm lint` and `pnpm typecheck` before committing
- Leverage shared packages (`@sabron/types`, `@sabron/validation`) for consistency
- API calls should go through `@sabron/api-client` for type safety

### Testing Requirements
- Write unit tests for complex components and utilities
- Use Storybook for UI component documentation
- Test API endpoints and database operations
- Run `pnpm test:ci` to ensure coverage requirements

### Database Operations
- Always run `pnpm db:generate` after schema changes
- Use `pnpm db:migrate` for development migrations
- Production migrations use `prisma migrate deploy`
- Database schema located at `packages/database/prisma/schema.prisma`

## Memories
- Always use pnpm first
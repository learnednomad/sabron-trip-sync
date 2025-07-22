# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This repository contains two main projects:

1. **sabron-trip-sync/** - Main monorepo with web app, API, and shared packages
2. **trip-sync-mobile/** - Separate React Native/Expo mobile application

When working with either project, navigate to the appropriate directory first.

## Core Development Commands

### Monorepo Commands (sabron-trip-sync/)
- `pnpm dev` - Start all services (web, API) in development mode
- `pnpm build` - Build all packages and applications
- `pnpm test` - Run tests across all packages
- `pnpm test:ci` - Run tests with coverage for CI/CD
- `pnpm lint` - Lint all TypeScript/JavaScript files
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm typecheck` - Type check all TypeScript files
- `pnpm check` - Run lint, typecheck, and test together
- `pnpm quality-check` - Full quality check with audit
- `pnpm reset` - Clean all node_modules and reinstall

### Individual Service Commands (sabron-trip-sync/)
- **Web**: `cd apps/web && pnpm dev` - Start Next.js on http://localhost:3001
- **API**: `cd services/api && pnpm dev` - Start Hono API on http://localhost:3000

### Database Commands (sabron-trip-sync/)
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations in development
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio for database management

### Docker Commands (sabron-trip-sync/)
- `pnpm docker:build` - Build Docker containers
- `pnpm docker:up` - Start services with Docker Compose
- `pnpm docker:down` - Stop Docker containers

### Mobile Commands (trip-sync-mobile/)
- `pnpm start` - Start Expo development server
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS device/simulator
- `pnpm test` - Run Jest tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Lint TypeScript/JavaScript files
- `pnpm type-check` - Type check TypeScript files
- `pnpm check-all` - Run all quality checks (lint, type-check, test)

## Architecture Overview

### Sabron Trip Sync Monorepo Structure
This is a pnpm workspace monorepo using Turborepo for task orchestration:

**Apps:**
- `apps/web/` - Next.js 15 web dashboard with TypeScript, Tailwind CSS, shadcn/ui

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

### Trip Sync Mobile Structure
Separate React Native/Expo project with:
- `src/app/` - Expo Router file-based routing
- `src/components/` - Reusable components including ui/ directory
- `src/api/` - API client using React Query
- `src/lib/` - Shared utilities, hooks, auth, i18n
- `src/translations/` - i18n translation files

### Key Technologies

**Monorepo:**
- **Framework**: React 19, Next.js 15.3.5
- **Backend**: Hono, Prisma ORM, PostgreSQL, Redis, MongoDB, Supabase Auth
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query/TanStack Query
- **Testing**: Vitest (web), custom setup (API)

**Mobile:**
- **Framework**: React Native 0.79.4, Expo SDK 53
- **Routing**: Expo Router
- **Styling**: NativeWind (Tailwind for React Native)
- **State Management**: Zustand, React Query
- **Testing**: Jest, React Native Testing Library

### Data Flow Architecture

**Monorepo:**
1. **API Layer** (`services/api/`): Hono server with OpenAPI documentation at `/docs`
2. **Client Layer** (`packages/api-client/`): Type-safe API client using React Query
3. **Validation Layer** (`packages/validation/`): Zod schemas shared between client and server
4. **UI Layer** (`packages/ui/`): Reusable components with consistent design system
5. **App Layer** (`apps/web/`): Web application consuming shared packages

**Mobile:**
1. **API Layer** (`src/api/`): Axios-based client with React Query hooks
2. **Component Layer** (`src/components/`): Reusable components with ui/ primitives
3. **App Layer** (`src/app/`): Expo Router screens and navigation

### Development Environment Requirements
- Node.js ≥22.17.0
- pnpm 10.12.3 (managed via `packageManager` field)
- PostgreSQL, Redis, MongoDB for full backend functionality
- Expo CLI for mobile development

### Mobile Development Guidelines
Follow the Cursor rules in `trip-sync-mobile/.cursorrules`:
- Use TypeScript with explicit types, avoid interfaces/enums
- Functional components with descriptive variable names (isLoading, hasError)
- Component modularity: max 80 lines per component
- NativeWind for styling with predefined colors/fonts
- Absolute imports with `@/` prefix
- Named exports, kebab-case file names
- Install packages with `npx expo install <package>`
- Use `src/` directory structure as defined

### Testing Strategy
- **Web**: Vitest with React Testing Library
- **API**: Custom test setup (check `services/api/` for specifics)
- **Mobile**: Jest with React Native Testing Library
- **UI Components**: Both unit tests and Storybook stories

### Environment Variables
Key environment variables defined in `turbo.json`:
- Database: `DATABASE_URL`, `REDIS_URL`, `MONGODB_URI`
- Auth: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`
- Frontend: `NEXT_PUBLIC_API_URL`, `EXPO_PUBLIC_API_URL`
- Monitoring: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_SENTRY_DSN`

### Workspace Dependencies
Apps and packages reference each other using `workspace:*` protocol in the monorepo. Always check package.json files to understand the dependency graph before making changes that might affect multiple packages.

## Development Best Practices

### Code Standards
- Use conventional commits (feat:, fix:, docs:, etc.)
- Run `pnpm lint` and `pnpm typecheck` before committing
- Leverage shared packages (`@sabron/types`, `@sabron/validation`) for consistency in monorepo
- API calls should go through `@sabron/api-client` for type safety in monorepo

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

## Project-Specific Notes

### Mobile Development
- Use `npx expo install` instead of `pnpm add` for React Native packages
- Follow the file structure in `src/` directory
- Use NativeWind for styling with predefined colors/fonts
- Test on both platforms (iOS and Android) when possible

### API Development
- API documentation available at http://localhost:3000/docs in development
- Use Hono framework patterns for route definitions
- Leverage Prisma for database operations
- Implement proper error handling and validation

### Web Development
- Use Next.js 15 App Router patterns
- Leverage shadcn/ui components from `@sabron/ui`
- Implement proper SEO and accessibility standards
- Use React Query for API state management
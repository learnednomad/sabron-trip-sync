```markdown
# Sabron Trip Sync

A comprehensive travel planning platform with a mobile app (React Native with Expo), web dashboard (Next.js), and API backend (Hono with Prisma, Supabase, Redis, MongoDB).

## Tech Stack
- **Monorepo**: pnpm@9.5.0, Turborepo@2.0.6
- **Mobile**: React Native@0.74.1, Expo SDK@51, NativeWind
- **Web**: Next.js@14.1.0, Tailwind CSS, shadcn/ui
- **API**: Hono@3.12.0, Prisma, Supabase, Redis@7, MongoDB@7
- **Shared**: TypeScript, Zod, Radix UI, i18next
- **Deployment**: Coolify (Docker-based)

## Project Structure
```
sabron-trip-sync/
├── apps/
│   ├── web/              # Next.js web dashboard
│   └── mobile/           # React Native mobile app
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── validation/       # Zod validation schemas
│   ├── ui/               # Shared UI components (shadcn/ui)
│   ├── database/         # Prisma client and schema
│   ├── api-client/       # API client with React Query hooks
│   └── i18n/             # Internationalization setup
├── services/
│   └── api/              # Hono API backend
├── .github/workflows/    # CI/CD workflows
├── docker/               # Docker configurations
└── docs/                 # Documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd sabron-trip-sync
   ```

2. **Install dependencies**:
   ```bash
   corepack enable
   corepack prepare pnpm@9.5.0 --activate
   pnpm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env.local` in `apps/web`, `apps/mobile`, and `services/api`.
   - Update with your Supabase, Sentry, Redis, and MongoDB credentials.

4. **Run database migrations**:
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start development servers**:
   ```bash
   pnpm dev
   ```
   - Web: http://localhost:3001
   - API: http://localhost:3000
   - Mobile: Run `pnpm start` in `apps/mobile` and scan the QR code with Expo Go.

6. **Run tests**:
   ```bash
   pnpm test
   ```

7. **Build for production**:
   ```bash
   pnpm build
   pnpm docker:build
   pnpm docker:up
   ```

## Key Features
- **Itinerary Management**: Create and manage detailed travel itineraries.
- **Activity Planning**: Schedule activities with booking integration.
- **Authentication**: Supabase-based auth with email/password and OAuth.
- **Offline Support**: React Query caching and Expo file system for mobile.
- **Internationalization**: Multi-language support with i18next.
- **Accessibility**: Radix UI components with ARIA support.
- **Error Tracking**: Sentry integration for all services.
- **API Documentation**: OpenAPI with Swagger UI at `/docs`.

## Development Guidelines
- **Commits**: Use conventional commits (e.g., `feat: add login form`, `fix: resolve auth bug`).
- **Components**: Use `@sabron/ui` for shared components, following shadcn/ui patterns.
- **API**: Use `@sabron/api-client` for type-safe API calls.
- **Testing**: Write unit tests with Vitest/Jest and Storybook stories for UI components.
- **Linting**: Run `pnpm lint` before committing.
- **Type Safety**: Use `@sabron/types` and `@sabron/validation` for all data operations.

## Deployment
- **Coolify**: Configure with Docker Compose and environment variables.
- **CI/CD**: GitHub Actions for linting, testing, and deployment.
- **Environment Variables**: Ensure `.env` files are properly configured for production.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/your-feature`).
3. Commit changes with conventional commits.
4. Run tests and linting.
5. Submit a pull request.

## Troubleshooting
- **Build Issues**: Ensure Node.js@20.14.0 and pnpm@9.5.0 are used.
- **Database Errors**: Verify PostgreSQL, Redis, and MongoDB connections.
- **Auth Issues**: Check Supabase credentials and URL configurations.
- **Offline Mode**: Ensure `expo-file-system` and `NetInfo` are properly set up.

For detailed API documentation, visit `http://localhost:3000/docs` in development.
```


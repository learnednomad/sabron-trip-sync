# AI Team Collaboration Brief - Sabron-Trip-Sync

## Project Overview

**Project Name:** Sabron-Trip-Sync
**Description:** A comprehensive travel planning and synchronization application
**GitHub Repository:** https://github.com/learnednomad/sabron-trip-sync
**Architecture:** Monorepo with pnpm workspace using Turborepo

## Technology Stack

### Frontend
- **Web App:** Next.js 14 with TypeScript, Tailwind CSS, shadcn/ui components
- **Mobile App:** React Native with Expo SDK 53, Expo Router, NativeWind
- **Styling:** Tailwind CSS, NativeWind, shadcn/ui design system
- **State Management:** Zustand, React Query/TanStack Query

### Backend
- **API Framework:** Hono (lightweight web framework)
- **Database ORM:** Prisma
- **Databases:** PostgreSQL (primary), Redis (caching), MongoDB (documents)
- **Authentication:** Supabase Auth
- **Validation:** Zod schemas (shared between client and server)

### Development & DevOps
- **Package Manager:** pnpm 10.12.3
- **Build System:** Turborepo for monorepo orchestration
- **Testing:** Jest (mobile), Vitest (web/packages), React Testing Library
- **Deployment:** Docker, Coolify
- **Monitoring:** Sentry integration
- **CI/CD:** GitHub Actions

## Current Architecture

### Monorepo Structure
```
sabron-trip-sync/
├── apps/
│   ├── web/              # Next.js 14 web dashboard
│   └── mobile/           # React Native app with Expo
├── services/
│   └── api/              # Hono backend API
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── validation/       # Zod schemas
│   ├── ui/               # Shared UI components
│   ├── database/         # Prisma schema and utilities
│   ├── api-client/       # Type-safe API client
│   └── i18n/             # Internationalization
└── tools/
    ├── eslint-config/    # Shared ESLint configurations
    └── typescript-config/ # Shared TypeScript configurations
```

## Current Status

### ✅ Completed
- [x] Basic monorepo architecture setup
- [x] Database schemas designed
- [x] Development environment configured
- [x] Package structure established
- [x] Basic CI/CD workflows
- [x] Docker containerization setup

### 🔄 In Progress
- [ ] Core feature implementation
- [ ] API endpoint development
- [ ] Frontend component development
- [ ] Mobile app features
- [ ] Authentication integration
- [ ] Database operations

### 📋 Pending
- [ ] Complete feature implementation
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Documentation
- [ ] Production deployment

## Key Development Commands

### Core Commands
- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all packages and applications
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all TypeScript/JavaScript files
- `pnpm typecheck` - Type check all TypeScript files

### Database Commands
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio

## AI Team Roles Discussion

### Suggested Roles Based on AI Strengths:

#### 1. **Project Manager & Architect** (Suggested: Gemini)
- **Responsibilities:**
  - Overall project coordination
  - Architecture decisions
  - Task prioritization and assignment
  - Progress tracking and reporting
  - Cross-team communication

#### 2. **Backend & API Developer** (Suggested: Claude)
- **Responsibilities:**
  - Hono API development
  - Database schema design and optimization
  - Prisma ORM implementation
  - Authentication and security
  - Performance optimization

#### 3. **Frontend Developer** (Suggested: ChatGPT/OpenAI)
- **Responsibilities:**
  - Next.js web application
  - React Native mobile app
  - UI/UX component development
  - State management with Zustand
  - Responsive design implementation

#### 4. **DevOps & Testing Specialist** (Suggested: Grok)
- **Responsibilities:**
  - CI/CD pipeline optimization
  - Docker and deployment setup
  - Testing framework implementation
  - Performance monitoring
  - Security auditing

## Development Workflow

### 1. Planning Phase
- Define feature requirements
- Create technical specifications
- Design database schemas
- Plan API endpoints

### 2. Development Phase
- Implement backend APIs
- Develop frontend components
- Create mobile app features
- Write comprehensive tests

### 3. Integration Phase
- Connect frontend to backend
- Test cross-platform compatibility
- Implement real-time features
- Performance optimization

### 4. Deployment Phase
- Production deployment
- Monitoring setup
- Documentation
- User testing

## Key Challenges & Considerations

1. **Monorepo Complexity:** Managing dependencies across multiple packages
2. **Cross-Platform Consistency:** Ensuring consistent UX between web and mobile
3. **Performance:** Optimizing for both web and mobile platforms
4. **Real-time Features:** Implementing sync capabilities
5. **Scalability:** Designing for future growth

## Communication Protocol

### Daily Standups
- Share progress updates
- Discuss blockers and challenges
- Coordinate cross-team dependencies

### Code Reviews
- All code changes require peer review
- Focus on code quality and consistency
- Ensure adherence to project standards

### Documentation
- Maintain up-to-date README files
- Document API endpoints and schemas
- Keep architecture decisions recorded

## Next Steps

1. **Role Assignment:** Confirm AI team member roles and responsibilities
2. **Sprint Planning:** Define first sprint goals and deliverables
3. **Environment Setup:** Ensure all team members can access the codebase
4. **Feature Prioritization:** Identify and prioritize core features for MVP
5. **Development Kickoff:** Begin coordinated development work

---

**Note:** This brief should be shared with each AI team member for review and discussion. Each AI should provide feedback on their preferred role and suggest any modifications to the proposed structure.
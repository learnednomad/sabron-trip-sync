#!/usr/bin/env node

/**
 * Sabron-Trip-Sync GitHub Project Setup Script
 * 
 * This script automates the creation of:
 * - GitHub labels for Sabron-Trip-Sync
 * - Initial epic issues aligned with our development plan
 * - Sprint task templates
 * - Project milestones for 4-phase development
 * 
 * Usage:
 * 1. cd scripts && npm install
 * 2. Copy .env.example to .env and add your GITHUB_TOKEN
 * 3. Run: node setup-github-project.js
 */

const { Octokit } = require("@octokit/rest");
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration aligned with Sabron-Trip-Sync requirements
const LABELS = [
  // Feature Areas (based on our functional requirements)
  { name: 'feature:auth', color: '6B46C1', description: 'Authentication & user management (FR-001 to FR-006)' },
  { name: 'feature:itinerary', color: '0052CC', description: 'Itinerary management (FR-010 to FR-016)' },
  { name: 'feature:visa', color: '00875A', description: 'Visa & documentation (FR-020 to FR-024)' },
  { name: 'feature:cultural', color: '8B5CF6', description: 'Cultural information (FR-030 to FR-034)' },
  { name: 'feature:expense', color: 'DE350B', description: 'Financial features (FR-040 to FR-045)' },
  { name: 'feature:social', color: '5319E7', description: 'Social & communication (FR-050 to FR-054)' },
  { name: 'feature:maps', color: 'FBCA04', description: 'Maps & navigation (FR-060 to FR-064)' },
  { name: 'feature:booking', color: '10B981', description: 'Booking integration (FR-070 to FR-074)' },
  { name: 'feature:safety', color: 'F59E0B', description: 'Safety & support (FR-080 to FR-084)' },
  { name: 'feature:offline', color: '344563', description: 'Offline functionality' },
  { name: 'feature:ar', color: 'E99695', description: 'AR navigation features' },
  { name: 'feature:analytics', color: '3B82F6', description: 'Analytics dashboard' },
  
  // Platforms (based on our tech stack)
  { name: 'platform:mobile', color: '1D76DB', description: 'React Native/Expo mobile app' },
  { name: 'platform:web', color: 'B60205', description: 'Next.js web dashboard' },
  { name: 'platform:api', color: '0E8A16', description: 'Hono API backend' },
  { name: 'platform:db', color: 'F9D0C4', description: 'Prisma/PostgreSQL database' },
  { name: 'platform:coolify', color: '6366F1', description: 'Coolify deployment' },
  
  // Types
  { name: 'type:epic', color: '7B68EE', description: 'Large feature spanning multiple sprints' },
  { name: 'type:bug', color: 'D73A4A', description: 'Something isn\'t working' },
  { name: 'type:feature', color: 'A2EEEF', description: 'New feature or request' },
  { name: 'type:docs', color: '0075CA', description: 'Documentation' },
  { name: 'type:test', color: 'CFD3D7', description: 'Testing' },
  { name: 'type:refactor', color: 'FEF2C0', description: 'Code refactoring' },
  { name: 'type:performance', color: 'D4C5F9', description: 'Performance improvements' },
  { name: 'type:security', color: 'C53030', description: 'Security related' },
  { name: 'type:accessibility', color: '805AD5', description: 'Accessibility improvements' },
  
  // Priorities
  { name: 'priority:critical', color: 'B60205', description: 'Critical - drop everything' },
  { name: 'priority:high', color: 'D93F0B', description: 'High priority' },
  { name: 'priority:medium', color: 'FBCA04', description: 'Medium priority' },
  { name: 'priority:low', color: '0E8A16', description: 'Low priority' },
  
  // Workflow
  { name: 'phase:1-foundation', color: '2EA44F', description: 'Phase 1: Foundation (Months 1-3)' },
  { name: 'phase:2-core', color: '2EA44F', description: 'Phase 2: Core Features (Months 4-6)' },
  { name: 'phase:3-advanced', color: '2EA44F', description: 'Phase 3: Advanced Features (Months 7-9)' },
  { name: 'phase:4-polish', color: '2EA44F', description: 'Phase 4: Polish & Scale (Months 10-12)' },
  { name: 'sprint:ready', color: '2EA44F', description: 'Ready for sprint planning' },
  { name: 'blocked', color: 'B60205', description: 'Blocked by external dependency' },
  { name: 'help-wanted', color: '008672', description: 'Extra attention needed' },
  { name: 'good-first-issue', color: '7057FF', description: 'Good for newcomers' },
  
  // Non-functional requirements
  { name: 'nfr:performance', color: 'EC4899', description: 'Performance requirements (NFR-001 to NFR-005)' },
  { name: 'nfr:security', color: 'DC2626', description: 'Security requirements (NFR-010 to NFR-014)' },
  { name: 'nfr:accessibility', color: '7C3AED', description: 'Accessibility requirements (NFR-020 to NFR-024)' },
  { name: 'nfr:usability', color: 'F59E0B', description: 'Usability requirements (NFR-030 to NFR-034)' },
  { name: 'nfr:scalability', color: '059669', description: 'Scalability requirements (NFR-050 to NFR-054)' }
];

const MILESTONES = [
  {
    title: 'Phase 1: Foundation (Months 1-3)',
    description: `Foundation setup for Sabron-Trip-Sync

## 🎯 Goals
- ✅ Monorepo structure with Turborepo
- ✅ Supabase authentication system
- ✅ Basic trip/itinerary CRUD operations
- ✅ Prisma database schema
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Design system and component library
- ✅ Error monitoring with Sentry
- ✅ Docker development environment

## 📊 Success Metrics
- All core infrastructure operational
- Authentication flow < 3 seconds
- Database migrations working
- CI/CD pipeline < 5 minutes

## 🏃 Timeline
12 weeks (Months 1-3)

## 👥 Team
2 frontend, 2 backend, 1 DevOps, 1 UI/UX designer`,
    due_on: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Phase 2: Core Features (Months 4-6)',
    description: `Core travel planning features for Sabron-Trip-Sync

## 🎯 Goals
- 🚀 Real-time collaborative editing with WebSockets
- 🌍 Visa requirements lookup system
- 💰 Expense tracking and budget management
- 📱 Offline mode with MMKV storage and sync
- 🌐 Multi-language support (EN, ES, ZH, AR)
- 🔔 Push notification system
- 🛡️ Security measures and data encryption

## 📊 Success Metrics
- < 2 seconds itinerary load time
- Zero data loss in offline mode
- 99% visa information accuracy
- 95% user satisfaction with collaboration

## 🏃 Timeline
12 weeks (Months 4-6)

## 👥 Team
3 frontend, 2 backend, 1 mobile, 1 QA engineer`,
    due_on: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Phase 3: Advanced Features (Months 7-9)',
    description: `Advanced features and integrations for Sabron-Trip-Sync

## 🎯 Goals
- 🗺️ AR navigation with Mapbox integration
- ✈️ Booking integration APIs (flights, hotels, activities)
- 👥 Social features (activity feed, group chat, sharing)
- 📊 Analytics dashboard for web platform
- 🏢 Partner portal for service providers
- 💳 Payment integration with Stripe
- 📈 Price tracking and alert system
- 🚨 Emergency features and safety tools

## 📊 Success Metrics
- AR navigation accuracy > 95%
- Booking conversion rate > 15%
- Social engagement metrics established
- Partner portal operational

## 🏃 Timeline
12 weeks (Months 7-9)

## 👥 Team
4 frontend, 2 backend, 1 mobile, 2 QA engineers`,
    due_on: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Phase 4: Polish & Scale (Months 10-12)',
    description: `Production ready for launch - Sabron-Trip-Sync

## 🎯 Goals
- ⚡ Performance optimization (< 2s app launch)
- 🔒 Security hardening and penetration testing
- 🧪 Beta testing with 1,000 users
- 📱 App Store and Google Play store setup
- 🌐 Marketing website and landing pages
- 📊 Monitoring and alerting setup
- 📚 Documentation and user guides
- 🎯 Launch preparation for 100,000 users

## 📊 Success Metrics
- < 0.1% crash rate
- 99.9% uptime SLA
- 4.5+ app store rating
- 70% user retention rate
- WCAG 2.1 AA compliance

## 🏃 Timeline
12 weeks (Months 10-12)

## 👥 Team
Full team (12 members) + external security consultant`,
    due_on: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  }
];

const EPIC_ISSUES = [
  {
    title: '[EPIC] User Authentication & Profile Management',
    body: `## 🔐 Overview
Complete user authentication system with profile management for Sabron-Trip-Sync.

## 🎯 Objectives
- Secure, seamless authentication across mobile and web platforms
- Social login integration (Google, Apple, Facebook)
- Profile synchronization and management
- WCAG 2.1 AA compliant authentication flows
- Multi-factor authentication support

## ✨ User Stories

### Authentication (FR-001 to FR-006)
- [ ] **FR-001**: As a user, I want to sign up with email/password with verification
- [ ] **FR-002**: As a user, I want to log in with Google/Apple/Facebook
- [ ] **FR-003**: As a user, I want to enable multi-factor authentication
- [ ] **FR-004**: As a user, I want to reset my password with secure tokens
- [ ] **FR-005**: As a user, I want my session to persist across devices
- [ ] **FR-006**: As an admin, I want role-based access control

### Profile Management
- [ ] As a user, I want to edit my profile information
- [ ] As a user, I want to upload and manage my profile photo
- [ ] As a user, I want to set my travel preferences
- [ ] As a user, I want to view my subscription status
- [ ] As a user, I want to manage my notification preferences

## 🔧 Technical Requirements
- **Backend**: Supabase Auth with RLS policies
- **Mobile**: Biometric authentication (Face ID/Touch ID)
- **Web**: Server-side session management
- **Security**: JWT tokens, secure session management
- **Storage**: Profile photos in Supabase Storage
- **Database**: User profiles with preferences

## 📊 Success Metrics
- [ ] < 3 seconds authentication flow
- [ ] 99.9% authentication service uptime
- [ ] Zero security vulnerabilities
- [ ] 100% accessibility compliance
- [ ] 95% user satisfaction with auth flow

## 🏃 Sprint Breakdown
- **Sprint 1**: Supabase setup, basic auth backend
- **Sprint 2**: Login/signup screens, form validation
- **Sprint 3**: Social authentication, profile management
- **Sprint 4**: Biometric auth, MFA, security hardening

## 🔗 Related Issues
Links to specific implementation tasks will be added here.`,
    labels: ['type:epic', 'feature:auth', 'priority:critical', 'phase:1-foundation'],
    milestone: 1
  },
  {
    title: '[EPIC] Trip Planning & Itinerary Management',
    body: `## ✈️ Overview
Core trip planning functionality with intuitive drag-and-drop itinerary builder and real-time collaboration.

## 🎯 Objectives
- Seamless trip creation and management
- Real-time collaborative editing for up to 10 users
- Offline-first architecture with automatic sync
- Smart suggestions and trip templates
- Version history and change tracking

## ✨ User Stories

### Itinerary Management (FR-010 to FR-016)
- [ ] **FR-010**: As a user, I want to create/edit/delete trips
- [ ] **FR-011**: As a user, I want to drag-and-drop activities in my itinerary
- [ ] **FR-012**: As a user, I want to import bookings from email
- [ ] **FR-013**: As a user, I want real-time collaborative editing
- [ ] **FR-014**: As a user, I want version history with rollback capability
- [ ] **FR-015**: As a user, I want offline mode with automatic sync
- [ ] **FR-016**: As a user, I want to export my itinerary to calendar formats

### Collaboration Features
- [ ] As a user, I want to invite up to 10 collaborators
- [ ] As a user, I want to see real-time updates from other users
- [ ] As a user, I want to see who's currently editing
- [ ] As a user, I want to resolve editing conflicts
- [ ] As a user, I want to comment on activities
- [ ] As a user, I want to assign tasks to travel companions

## 🔧 Technical Requirements
- **Mobile**: react-native-draggable-flatlist for drag-and-drop
- **Real-time**: WebSocket connections with automatic reconnection
- **Offline**: MMKV storage with sync queue
- **Collaboration**: Operational Transformation for conflict resolution
- **Performance**: < 100ms drag response time
- **Sync**: Bidirectional sync with conflict resolution

## 📊 Success Metrics
- [ ] < 2 seconds to load itinerary
- [ ] Zero data loss in offline mode
- [ ] 95% user satisfaction with itinerary builder
- [ ] < 1% sync conflicts
- [ ] Real-time updates < 500ms latency

## 🏃 Sprint Breakdown
- **Sprint 5**: Trip CRUD operations, basic itinerary structure
- **Sprint 6**: Drag-and-drop implementation, UI/UX
- **Sprint 7**: Real-time collaboration with WebSockets
- **Sprint 8**: Offline mode, sync queue, conflict resolution

## 🔗 Related Issues
Links to specific implementation tasks will be added here.`,
    labels: ['type:epic', 'feature:itinerary', 'priority:critical', 'phase:1-foundation'],
    milestone: 1
  },
  {
    title: '[EPIC] Visa Requirements & Documentation System',
    body: `## 📋 Overview
Comprehensive visa requirements and travel documentation management system.

## 🎯 Objectives
- Accurate, up-to-date visa information for 195+ countries
- Personalized requirements based on user nationality
- Document checklist and tracking system
- Offline access to critical visa information
- Embassy contact information and processing times

## ✨ User Stories

### Visa Requirements (FR-020 to FR-024)
- [ ] **FR-020**: As a user, I want dynamic visa requirement lookup
- [ ] **FR-021**: As a user, I want document checklist generation
- [ ] **FR-022**: As a user, I want to track my visa application status
- [ ] **FR-023**: As a user, I want embassy contact information
- [ ] **FR-024**: As a user, I want travel insurance recommendations

### Documentation Management
- [ ] As a user, I want to upload and store my travel documents
- [ ] As a user, I want expiry date reminders for documents
- [ ] As a user, I want to share documents with travel companions
- [ ] As a user, I want to access documents offline
- [ ] As a user, I want document templates and guides

## 🔧 Technical Requirements
- **API**: Multiple visa API providers with fallbacks
- **Caching**: 30-day offline cache for visa information
- **Storage**: Encrypted document storage in Supabase
- **Languages**: Multi-language support (EN, ES, ZH, AR)
- **Security**: End-to-end encryption for sensitive documents
- **Performance**: < 1 second visa lookup time

## 📊 Success Metrics
- [ ] 99% visa information accuracy
- [ ] < 1 second lookup time
- [ ] 100% offline availability for cached data
- [ ] Support for 195+ countries
- [ ] 90% user satisfaction with visa info

## 🏃 Sprint Breakdown
- **Sprint 9**: Visa API integration, data modeling
- **Sprint 10**: Document management system, encryption
- **Sprint 11**: Offline caching, sync implementation
- **Sprint 12**: Multi-language support, UI polish

## 🔗 Related Issues
Links to specific implementation tasks will be added here.`,
    labels: ['type:epic', 'feature:visa', 'priority:high', 'phase:2-core'],
    milestone: 2
  },
  {
    title: '[EPIC] Cultural Information & Local Insights',
    body: `## 🌍 Overview
Cultural information system with local insights, user-generated content, and multi-language support.

## 🎯 Objectives
- Location-based cultural tips and customs
- User-generated content with moderation
- Multi-language translation system
- Offline content caching
- Community-driven content quality

## ✨ User Stories

### Cultural Information (FR-030 to FR-034)
- [ ] **FR-030**: As a user, I want location-based cultural tips
- [ ] **FR-031**: As a user, I want to submit cultural tips and insights
- [ ] **FR-032**: As a moderator, I want content moderation workflow
- [ ] **FR-033**: As a user, I want content in multiple languages
- [ ] **FR-034**: As a user, I want offline access to cultural content

### Community Features
- [ ] As a user, I want to rate and review cultural tips
- [ ] As a user, I want to bookmark useful cultural information
- [ ] As a user, I want to report inappropriate content
- [ ] As a user, I want to follow trusted contributors
- [ ] As a user, I want personalized cultural recommendations

## 🔧 Technical Requirements
- **Content**: User-generated content with moderation queue
- **Languages**: Translation system for EN, ES, ZH, AR
- **Caching**: Offline content caching with selective sync
- **Moderation**: Automated and manual content moderation
- **Search**: Full-text search with location filters
- **Analytics**: Content engagement tracking

## 📊 Success Metrics
- [ ] 80% user engagement with cultural content
- [ ] < 24 hours moderation response time
- [ ] 90% content accuracy rating
- [ ] 50+ cultural tips per major destination
- [ ] 95% offline content availability

## 🏃 Sprint Breakdown
- **Sprint 13**: Content management system, data models
- **Sprint 14**: User submission system, moderation tools
- **Sprint 15**: Multi-language translation integration
- **Sprint 16**: Offline caching, search functionality

## 🔗 Related Issues
Links to specific implementation tasks will be added here.`,
    labels: ['type:epic', 'feature:cultural', 'priority:high', 'phase:2-core'],
    milestone: 2
  },
  {
    title: '[EPIC] Financial Management & Expense Tracking',
    body: `## 💰 Overview
Comprehensive financial management system with expense tracking, budget management, and group expense splitting.

## 🎯 Objectives
- Multi-currency budget tracking
- Expense categorization and splitting
- Receipt scanning and storage
- Payment integration with Stripe
- Financial report generation

## ✨ User Stories

### Financial Features (FR-040 to FR-045)
- [ ] **FR-040**: As a user, I want multi-currency budget tracking
- [ ] **FR-041**: As a user, I want expense categorization
- [ ] **FR-042**: As a user, I want group expense splitting
- [ ] **FR-043**: As a user, I want receipt scanning and storage
- [ ] **FR-044**: As a user, I want payment integration
- [ ] **FR-045**: As a user, I want financial report generation

### Budget Management
- [ ] As a user, I want to set trip budgets by category
- [ ] As a user, I want budget alerts and notifications
- [ ] As a user, I want to track spending against budget
- [ ] As a user, I want expense splitting calculations
- [ ] As a user, I want to settle group expenses

## 🔧 Technical Requirements
- **Payment**: Stripe integration for payments
- **Currency**: Real-time exchange rate API
- **OCR**: Receipt scanning with text extraction
- **Storage**: Encrypted receipt storage
- **Calculations**: Complex expense splitting algorithms
- **Reporting**: PDF/CSV export functionality

## 📊 Success Metrics
- [ ] 95% receipt OCR accuracy
- [ ] < 2 seconds expense entry time
- [ ] 90% user satisfaction with splitting
- [ ] 99% payment processing reliability
- [ ] Zero financial calculation errors

## 🏃 Sprint Breakdown
- **Sprint 17**: Basic expense tracking, currency conversion
- **Sprint 18**: Group expense splitting, calculations
- **Sprint 19**: Receipt scanning, OCR integration
- **Sprint 20**: Stripe payment integration, reporting

## 🔗 Related Issues
Links to specific implementation tasks will be added here.`,
    labels: ['type:epic', 'feature:expense', 'priority:high', 'phase:2-core'],
    milestone: 2
  },
  {
    title: '[EPIC] Maps, Navigation & AR Features',
    body: `## 🗺️ Overview
Advanced maps and navigation system with AR overlay and offline map support.

## 🎯 Objectives
- Interactive maps with offline support
- AR navigation with 2D fallback
- Transit route planning
- Location-based recommendations
- Point of interest integration

## ✨ User Stories

### Maps & Navigation (FR-060 to FR-064)
- [ ] **FR-060**: As a user, I want interactive map view
- [ ] **FR-061**: As a user, I want offline map downloads
- [ ] **FR-062**: As a user, I want AR navigation overlay
- [ ] **FR-063**: As a user, I want transit route planning
- [ ] **FR-064**: As a user, I want location-based recommendations

### AR Features
- [ ] As a user, I want AR directions to nearby attractions
- [ ] As a user, I want AR information overlays
- [ ] As a user, I want to switch between AR and 2D views
- [ ] As a user, I want AR photo opportunities
- [ ] As a user, I want AR location sharing

## 🔧 Technical Requirements
- **Maps**: Mapbox SDK with offline map support
- **AR**: React Native AR integration
- **Navigation**: GPS tracking and routing
- **Transit**: Public transit API integration
- **Performance**: Smooth AR rendering at 30fps
- **Fallback**: 2D map fallback for unsupported devices

## 📊 Success Metrics
- [ ] AR navigation accuracy > 95%
- [ ] < 3 seconds map load time
- [ ] 90% offline map coverage
- [ ] 60fps AR performance
- [ ] 85% user satisfaction with navigation

## 🏃 Sprint Breakdown
- **Sprint 21**: Mapbox integration, basic maps
- **Sprint 22**: Offline map downloads, caching
- **Sprint 23**: AR navigation implementation
- **Sprint 24**: Transit integration, POI recommendations

## 🔗 Related Issues
Links to specific implementation tasks will be added here.`,
    labels: ['type:epic', 'feature:maps', 'feature:ar', 'priority:medium', 'phase:3-advanced'],
    milestone: 3
  }
];

const INITIAL_TASKS = [
  {
    title: 'Set up monorepo with Turborepo',
    body: `## 📦 Task Description
Configure the monorepo structure using Turborepo for efficient development workflow.

## ✅ Acceptance Criteria
- [ ] Turborepo configuration file created
- [ ] Workspace structure organized (apps/, packages/, services/, tools/)
- [ ] Shared TypeScript configuration working
- [ ] Shared ESLint configuration applied
- [ ] Build pipeline optimized for parallel execution
- [ ] Hot reload working across all packages
- [ ] Cross-package imports functioning correctly

## 🎯 Definition of Done
- All packages build successfully with \`pnpm build\`
- Hot reload works across all workspaces
- TypeScript paths are properly configured
- CI/CD pipeline runs all builds in parallel
- Documentation updated with monorepo structure

## 🔧 Technical Implementation
\`\`\`json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
\`\`\`

## 📚 Resources
- [Turborepo Documentation](https://turbo.build/repo)
- [Sabron-Trip-Sync Development Plan](../development-plan.md)
- [CLAUDE.md Guidelines](../CLAUDE.md)`,
    labels: ['type:feature', 'platform:api', 'priority:critical', 'phase:1-foundation', 'sprint:ready'],
    milestone: 1
  },
  {
    title: 'Configure Supabase authentication system',
    body: `## 🔐 Task Description
Set up Supabase project and configure authentication providers for Sabron-Trip-Sync.

## ✅ Acceptance Criteria
- [ ] Supabase project created and configured
- [ ] Email/password authentication enabled
- [ ] Google OAuth provider configured
- [ ] Apple Sign In provider configured
- [ ] Facebook OAuth provider configured
- [ ] JWT settings optimized for our use case
- [ ] User profiles table created with proper schema
- [ ] Row Level Security (RLS) policies implemented
- [ ] Authentication flows tested on all platforms

## 🎯 Definition of Done
- Users can sign up/login with email on mobile and web
- Social authentication works on all platforms
- User sessions persist correctly across app restarts
- RLS policies prevent unauthorized data access
- Authentication errors are handled gracefully
- Security audit passes for auth implementation

## 🔧 Technical Implementation
\`\`\`sql
-- User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  nationality TEXT,
  preferences JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
\`\`\`

## 📊 Success Metrics
- Authentication flow completion time < 3 seconds
- 99.9% authentication success rate
- Zero unauthorized data access attempts
- 100% test coverage for auth flows

## 🔗 Related Requirements
- FR-001: Email/password authentication
- FR-002: Social login integration
- FR-003: Multi-factor authentication
- FR-004: Password reset functionality
- FR-005: Session management
- FR-006: Role-based access control`,
    labels: ['type:feature', 'feature:auth', 'platform:api', 'priority:critical', 'phase:1-foundation', 'sprint:ready'],
    milestone: 1
  },
  {
    title: 'Implement authentication screens (Mobile)',
    body: `## 📱 Task Description
Create login and signup screens for the mobile app with comprehensive form validation and accessibility support.

## ✅ Acceptance Criteria
- [ ] Login screen UI implemented matching design system
- [ ] Signup screen UI implemented with proper validation
- [ ] Form validation using react-hook-form with Zod schemas
- [ ] Password strength indicator implemented
- [ ] Biometric authentication integration (Face ID/Touch ID)
- [ ] Social login buttons functional
- [ ] Loading states and error handling implemented
- [ ] Forgot password flow completed
- [ ] Accessibility features implemented (WCAG 2.1 AA)
- [ ] Dark mode support
- [ ] Testing on iOS and Android devices

## 🎯 Definition of Done
- Screens match Figma designs pixel-perfectly
- Forms validate correctly with helpful error messages
- Authentication connects to Supabase backend
- Biometric authentication works on supported devices
- All accessibility standards met
- Screen reader support functional
- Performance metrics meet requirements (< 2s load time)

## 🔧 Technical Implementation
\`\`\`typescript
// Authentication schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Biometric authentication
const authenticateWithBiometrics = async () => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Sign in to Sabron-Trip-Sync',
    fallbackLabel: 'Use Password',
  });
  return result.success;
};
\`\`\`

## 🎨 Design Requirements
- Use Sabron-Trip-Sync color scheme and typography
- Ensure minimum 48px touch targets
- Support both light and dark modes
- Include haptic feedback for interactions
- Smooth animations and transitions
- Consistent spacing using design tokens

## 📊 Success Metrics
- Form validation prevents 100% of invalid submissions
- Authentication success rate > 95%
- Average authentication time < 3 seconds
- Accessibility score > 95%
- User satisfaction rating > 4.5/5

## 🔗 Related Requirements
- FR-001: Email/password authentication
- FR-002: Social login integration
- FR-003: Multi-factor authentication
- NFR-020: WCAG 2.1 AA compliance
- NFR-021: Screen reader support`,
    labels: ['type:feature', 'feature:auth', 'platform:mobile', 'priority:critical', 'phase:1-foundation', 'sprint:ready'],
    milestone: 1
  },
  {
    title: 'Create Prisma database schema',
    body: `## 🗄️ Task Description
Design and implement the complete database schema for Sabron-Trip-Sync using Prisma ORM.

## ✅ Acceptance Criteria
- [ ] User and profile models defined
- [ ] Trip and itinerary models implemented
- [ ] Activity and location models created
- [ ] Visa and document models established
- [ ] Cultural content models designed
- [ ] Expense and financial models implemented
- [ ] Social features models (comments, likes, shares)
- [ ] Notification models created
- [ ] Database relationships properly defined
- [ ] Indexes optimized for performance
- [ ] Data validation rules implemented
- [ ] Migration scripts created and tested

## 🎯 Definition of Done
- All models compile without errors
- Database migrations run successfully
- Seed data script populates test data
- Performance benchmarks meet requirements
- Foreign key constraints properly enforced
- Indexes improve query performance by 50%+

## 🔧 Technical Implementation
\`\`\`prisma
// Example models
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  profile       Profile?
  trips         Trip[]
  expenses      Expense[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  @@map("users")
}

model Trip {
  id            String      @id @default(cuid())
  title         String
  description   String?
  startDate     DateTime
  endDate       DateTime
  ownerId       String
  owner         User        @relation(fields: [ownerId], references: [id])
  collaborators TripCollaborator[]
  activities    Activity[]
  expenses      Expense[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  @@map("trips")
}
\`\`\`

## 📊 Performance Requirements
- Query response time < 100ms for basic operations
- Support for 100,000+ concurrent users
- Efficient indexing strategy
- Optimized for real-time collaboration queries

## 🔗 Related Requirements
- All functional requirements (FR-001 to FR-084)
- NFR-050: Horizontal scaling capability
- NFR-051: Database sharding support`,
    labels: ['type:feature', 'platform:db', 'priority:critical', 'phase:1-foundation', 'sprint:ready'],
    milestone: 1
  }
];

class SabronTripSyncProjectSetup {
  constructor(token, owner, repo) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    this.createdItems = {
      labels: [],
      milestones: [],
      issues: []
    };
  }

  async setupProject() {
    console.log('\n🚀 Sabron-Trip-Sync GitHub Project Setup\n');
    console.log(`Repository: ${this.owner}/${this.repo}\n`);

    try {
      // Create labels
      console.log('📏 Creating labels...');
      await this.createLabels();
      
      // Create milestones
      console.log('\n🎯 Creating milestones...');
      await this.createMilestones();
      
      // Create epic issues
      console.log('\n📋 Creating epic issues...');
      await this.createIssues(EPIC_ISSUES);
      
      // Create initial tasks
      console.log('\n✅ Creating initial sprint tasks...');
      await this.createIssues(INITIAL_TASKS);
      
      // Summary
      this.printSummary();
      
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      if (error.response) {
        console.error('Response:', error.response.data);
      }
      process.exit(1);
    }
  }

  async createLabels() {
    for (const label of LABELS) {
      try {
        await this.octokit.issues.createLabel({
          owner: this.owner,
          repo: this.repo,
          name: label.name,
          color: label.color,
          description: label.description
        });
        console.log(`  ✅ ${label.name}`);
        this.createdItems.labels.push(label.name);
      } catch (error) {
        if (error.status === 422) {
          console.log(`  ⏭️  ${label.name} (already exists)`);
        } else {
          console.error(`  ❌ ${label.name}: ${error.message}`);
        }
      }
    }
  }

  async createMilestones() {
    for (const milestone of MILESTONES) {
      try {
        const result = await this.octokit.issues.createMilestone({
          owner: this.owner,
          repo: this.repo,
          title: milestone.title,
          description: milestone.description,
          due_on: milestone.due_on.toISOString()
        });
        console.log(`  ✅ ${milestone.title}`);
        this.createdItems.milestones.push({
          title: milestone.title,
          number: result.data.number
        });
      } catch (error) {
        if (error.status === 422) {
          console.log(`  ⏭️  ${milestone.title} (already exists)`);
        } else {
          console.error(`  ❌ ${milestone.title}: ${error.message}`);
        }
      }
    }
  }

  async createIssues(issues) {
    for (const issue of issues) {
      try {
        const issueData = {
          owner: this.owner,
          repo: this.repo,
          title: issue.title,
          body: issue.body,
          labels: issue.labels
        };

        if (issue.milestone) {
          issueData.milestone = issue.milestone;
        }

        if (issue.assignees && issue.assignees.length > 0) {
          issueData.assignees = issue.assignees;
        }

        const result = await this.octokit.issues.create(issueData);
        console.log(`  ✅ #${result.data.number}: ${issue.title}`);
        this.createdItems.issues.push({
          number: result.data.number,
          title: issue.title,
          url: result.data.html_url
        });
      } catch (error) {
        console.error(`  ❌ ${issue.title}: ${error.message}`);
      }
    }
  }

  printSummary() {
    console.log('\n📊 Sabron-Trip-Sync Setup Summary\n');
    console.log(`✅ Created ${this.createdItems.labels.length} labels`);
    console.log(`✅ Created ${this.createdItems.milestones.length} milestones`);
    console.log(`✅ Created ${this.createdItems.issues.length} issues`);
    
    if (this.createdItems.issues.length > 0) {
      console.log('\n📝 Created Issues:');
      this.createdItems.issues.forEach(issue => {
        console.log(`  #${issue.number}: ${issue.title}`);
        console.log(`  ${issue.url}`);
      });
    }

    console.log('\n🎉 Sabron-Trip-Sync project setup complete!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Visit your GitHub repository to see the created issues');
    console.log('2. Set up your project board and link it to milestones');
    console.log('3. Start working on Phase 1 foundation tasks');
    console.log('4. Run `gh issue list --label "phase:1-foundation"` to see Phase 1 tasks');
    console.log('5. Review the development plan at development-plan.md');
    console.log('\n📚 Resources:');
    console.log('- Development Plan: development-plan.md');
    console.log('- Requirements: travelsync-requirements.md');
    console.log('- Setup Guide: CLAUDE.md');
  }
}

// Main execution
async function main() {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error('❌ Error: GITHUB_TOKEN not found in environment variables');
    console.error('\nPlease create a .env file with:');
    console.error('GITHUB_TOKEN=your_github_personal_access_token\n');
    console.error('Get a token from: https://github.com/settings/tokens');
    console.error('Required scopes: repo, write:packages, read:packages');
    process.exit(1);
  }

  // Get repository details
  const owner = await new Promise(resolve => {
    rl.question('GitHub username or organization: ', resolve);
  });
  
  const repo = await new Promise(resolve => {
    rl.question('Repository name (default: sabron-trip-sync): ', (answer) => {
      resolve(answer || 'sabron-trip-sync');
    });
  });

  rl.close();

  console.log('\n🎯 This will create:');
  console.log(`- ${LABELS.length} labels for issue organization`);
  console.log(`- ${MILESTONES.length} milestones for our 4-phase development plan`);
  console.log(`- ${EPIC_ISSUES.length} epic issues for major features`);
  console.log(`- ${INITIAL_TASKS.length} initial tasks to get started`);
  
  const confirm = await new Promise(resolve => {
    const confirmRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    confirmRl.question('\nProceed with setup? (y/N): ', (answer) => {
      confirmRl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });

  if (!confirm) {
    console.log('Setup cancelled.');
    process.exit(0);
  }

  // Run setup
  const setup = new SabronTripSyncProjectSetup(token, owner, repo);
  await setup.setupProject();
}

// Run the script
main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
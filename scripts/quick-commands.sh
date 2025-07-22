#!/bin/bash

# Quick Commands - Sanitized shortcuts for common development tasks
# Usage: source scripts/quick-commands.sh or ./scripts/quick-commands.sh <command>

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Quick development commands
quick_dev() {
    log_info "Starting all development services..."
    pnpm dev
}

quick_build() {
    log_info "Building all packages..."
    pnpm turbo run build --filter='{packages/*}' --filter='{services/*}' --filter='{apps/web}'
    log_success "Build completed"
}

quick_test() {
    log_info "Running tests with coverage..."
    pnpm turbo run test:ci --filter='{packages/*}' --filter='{services/*}' --filter='{apps/web}' --continue
    log_success "Tests completed"
}

quick_lint() {
    log_info "Running linting with auto-fix..."
    pnpm lint --fix
    log_success "Linting completed"
}

quick_typecheck() {
    log_info "Running TypeScript type checking..."
    pnpm typecheck
    log_success "Type checking completed"
}

quick_quality() {
    log_info "Running complete quality check..."
    pnpm check
    log_success "Quality check completed"
}

quick_clean() {
    log_info "Cleaning all caches and rebuilding..."
    pnpm reset
    pnpm install --frozen-lockfile
    log_success "Clean install completed"
}

quick_db() {
    local command=${1:-"generate"}
    case $command in
        "generate")
            log_info "Generating Prisma client..."
            pnpm db:generate
            ;;
        "migrate")
            log_info "Running database migrations..."
            pnpm db:migrate
            ;;
        "seed")
            log_info "Seeding database..."
            pnpm db:seed
            ;;
        "studio")
            log_info "Opening Prisma Studio..."
            pnpm db:studio
            ;;
        *)
            log_warning "Unknown database command: $command"
            echo "Available commands: generate, migrate, seed, studio"
            return 1
            ;;
    esac
    log_success "Database operation completed"
}

quick_git() {
    local command=${1:-"status"}
    case $command in
        "status")
            git status --short
            ;;
        "clean")
            log_info "Cleaning git workspace..."
            git clean -fd
            git checkout -- .
            log_success "Workspace cleaned"
            ;;
        "update")
            log_info "Updating main branch..."
            git checkout main
            git pull origin main
            log_success "Main branch updated"
            ;;
        *)
            log_warning "Unknown git command: $command"
            echo "Available commands: status, clean, update"
            return 1
            ;;
    esac
}

quick_workflow() {
    local command=${1:-"list"}
    case $command in
        "list")
            gh workflow list
            ;;
        "status")
            gh run list --limit 10
            ;;
        "ci")
            log_info "Triggering CI workflow..."
            gh workflow run ci-optimized.yml
            log_success "CI workflow triggered"
            ;;
        "security")
            log_info "Triggering security workflow..."
            gh workflow run security.yml
            log_success "Security workflow triggered"
            ;;
        *)
            log_warning "Unknown workflow command: $command"
            echo "Available commands: list, status, ci, security"
            return 1
            ;;
    esac
}

# Main function to handle command line arguments
main() {
    case ${1:-""} in
        "dev")
            quick_dev
            ;;
        "build")
            quick_build
            ;;
        "test")
            quick_test
            ;;
        "lint")
            quick_lint
            ;;
        "typecheck")
            quick_typecheck
            ;;
        "quality")
            quick_quality
            ;;
        "clean")
            quick_clean
            ;;
        "db")
            quick_db "${2:-generate}"
            ;;
        "git")
            quick_git "${2:-status}"
            ;;
        "workflow")
            quick_workflow "${2:-list}"
            ;;
        "help"|"-h"|"--help")
            echo "Quick Commands - Development shortcuts"
            echo ""
            echo "Usage: $0 <command> [options]"
            echo ""
            echo "Available commands:"
            echo "  dev       - Start all development services"
            echo "  build     - Build all packages"
            echo "  test      - Run tests with coverage"
            echo "  lint      - Run linting with auto-fix"
            echo "  typecheck - Run TypeScript type checking"
            echo "  quality   - Run complete quality check"
            echo "  clean     - Clean install all dependencies"
            echo "  db        - Database operations (generate|migrate|seed|studio)"
            echo "  git       - Git operations (status|clean|update)"
            echo "  workflow  - GitHub workflow operations (list|status|ci|security)"
            echo "  help      - Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 dev              # Start development servers"
            echo "  $0 db migrate       # Run database migrations"
            echo "  $0 git status       # Show git status"
            echo "  $0 workflow ci      # Trigger CI workflow"
            ;;
        "")
            log_warning "No command specified. Use 'help' for available commands."
            ;;
        *)
            log_warning "Unknown command: $1"
            echo "Use '$0 help' for available commands."
            exit 1
            ;;
    esac
}

# If script is being sourced, don't run main
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
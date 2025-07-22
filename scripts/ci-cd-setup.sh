#!/bin/bash

# CI/CD Pipeline Setup Script
# Automates common setup tasks for the Sabron Trip Sync CI/CD pipeline

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verify prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists "node"; then
        missing_deps+=("Node.js ≥22.17.0")
    elif [[ $(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1) -lt 22 ]]; then
        missing_deps+=("Node.js ≥22.17.0 (current: $(node --version))")
    fi
    
    if ! command_exists "pnpm"; then
        missing_deps+=("pnpm")
    fi
    
    if ! command_exists "git"; then
        missing_deps+=("git")
    fi
    
    if ! command_exists "gh"; then
        missing_deps+=("GitHub CLI (gh)")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo
        echo "Please install missing dependencies and run again."
        exit 1
    fi
    
    log_success "All prerequisites met"
}

# Setup development environment
setup_dev_environment() {
    log_info "Setting up development environment..."
    
    # Install dependencies
    log_info "Installing dependencies..."
    pnpm install --frozen-lockfile
    
    # Generate Prisma client
    log_info "Generating Prisma client..."
    pnpm db:generate
    
    # Build packages
    log_info "Building packages..."
    pnpm build
    
    log_success "Development environment setup complete"
}

# Setup GitHub workflows
setup_github_workflows() {
    log_info "Setting up GitHub workflows..."
    
    # Ensure .github/workflows directory exists
    mkdir -p .github/workflows
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository. Please run 'git init' first."
        exit 1
    fi
    
    # Check if workflows exist
    local workflows=(
        "ci-optimized.yml"
        "security.yml" 
        "codeql.yml"
        "sonarcloud.yml"
        "performance-monitoring.yml"
    )
    
    for workflow in "${workflows[@]}"; do
        if [[ -f ".github/workflows/$workflow" ]]; then
            log_success "Workflow $workflow exists"
        else
            log_warning "Workflow $workflow not found"
        fi
    done
    
    # Validate workflow syntax if gh CLI is available
    if command_exists "gh"; then
        log_info "Validating workflow syntax..."
        for workflow in "${workflows[@]}"; do
            if [[ -f ".github/workflows/$workflow" ]]; then
                if gh workflow view "$workflow" >/dev/null 2>&1; then
                    log_success "Workflow $workflow syntax valid"
                else
                    log_warning "Workflow $workflow syntax may have issues"
                fi
            fi
        done
    fi
}

# Setup branch protection
setup_branch_protection() {
    log_info "Setting up branch protection..."
    
    if ! command_exists "gh"; then
        log_warning "GitHub CLI not available, skipping branch protection setup"
        return
    fi
    
    # Check if we can access the repository
    if ! gh repo view >/dev/null 2>&1; then
        log_warning "Cannot access GitHub repository, skipping branch protection"
        return
    fi
    
    # Trigger branch protection setup workflow if it exists
    if gh workflow view setup-branch-protection.yml >/dev/null 2>&1; then
        log_info "Triggering branch protection setup workflow..."
        gh workflow run setup-branch-protection.yml -f branch=main
        log_success "Branch protection setup triggered"
    else
        log_warning "Branch protection workflow not found"
    fi
}

# Run quality checks
run_quality_checks() {
    log_info "Running quality checks..."
    
    # Type checking
    log_info "Running type checks..."
    if pnpm typecheck; then
        log_success "Type checking passed"
    else
        log_error "Type checking failed"
        return 1
    fi
    
    # Linting
    log_info "Running linting..."
    if pnpm lint; then
        log_success "Linting passed"
    else
        log_error "Linting failed"
        return 1
    fi
    
    # Tests
    log_info "Running tests..."
    if pnpm test:ci; then
        log_success "Tests passed"
    else
        log_error "Tests failed"
        return 1
    fi
    
    log_success "All quality checks passed"
}

# Clean up function
cleanup() {
    log_info "Cleaning up temporary files..."
    
    # Remove node_modules and reinstall
    rm -rf node_modules
    rm -rf apps/*/node_modules
    rm -rf packages/*/node_modules
    rm -rf services/*/node_modules
    
    # Clear Turbo cache
    rm -rf .turbo
    
    # Clear Next.js cache
    rm -rf apps/web/.next
    
    log_success "Cleanup complete"
}

# Performance analysis
analyze_performance() {
    log_info "Analyzing performance..."
    
    # Build with analysis
    log_info "Building with performance analysis..."
    pnpm turbo run build --summarize
    
    # Check bundle sizes
    log_info "Analyzing bundle sizes..."
    if [[ -d "apps/web/.next/static" ]]; then
        echo "Next.js bundle sizes:"
        find apps/web/.next/static -name "*.js" -exec echo -n "{}: " \; -exec wc -c {} \; | sort -k2 -nr | head -10
    fi
    
    log_success "Performance analysis complete"
}

# Main function
main() {
    echo "🚀 Sabron Trip Sync CI/CD Setup Script"
    echo "======================================"
    echo
    
    case "${1:-help}" in
        "setup")
            check_prerequisites
            setup_dev_environment
            setup_github_workflows
            setup_branch_protection
            ;;
        "check")
            check_prerequisites
            run_quality_checks
            ;;
        "workflows")
            setup_github_workflows
            ;;
        "protection")
            setup_branch_protection
            ;;
        "clean")
            cleanup
            setup_dev_environment
            ;;
        "analyze")
            analyze_performance
            ;;
        "help"|*)
            echo "Usage: $0 <command>"
            echo
            echo "Commands:"
            echo "  setup      - Full CI/CD pipeline setup"
            echo "  check      - Run all quality checks"
            echo "  workflows  - Setup GitHub workflows"
            echo "  protection - Setup branch protection"
            echo "  clean      - Clean and reinstall dependencies"
            echo "  analyze    - Analyze performance"
            echo "  help       - Show this help message"
            echo
            echo "Examples:"
            echo "  $0 setup     # Complete setup"
            echo "  $0 check     # Run quality checks"
            echo "  $0 clean     # Clean install"
            ;;
    esac
}

# Run main function with all arguments
main "$@"
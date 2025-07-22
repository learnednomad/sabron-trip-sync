#!/bin/bash

# Git Helper Scripts for CI/CD Pipeline
# Provides organized git commands for common CI/CD operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
}

# Create and switch to feature branch
create_feature_branch() {
    local branch_name="$1"
    if [[ -z "$branch_name" ]]; then
        log_error "Branch name required"
        echo "Usage: $0 feature <branch-name>"
        exit 1
    fi
    
    check_git_repo
    
    # Ensure we're on main and up to date
    git checkout main
    git pull origin main
    
    # Create and switch to feature branch
    git checkout -b "feature/$branch_name"
    log_success "Created and switched to feature/$branch_name"
}

# Create hotfix branch
create_hotfix_branch() {
    local branch_name="$1"
    if [[ -z "$branch_name" ]]; then
        log_error "Branch name required"
        echo "Usage: $0 hotfix <branch-name>"
        exit 1
    fi
    
    check_git_repo
    
    # Ensure we're on main and up to date
    git checkout main
    git pull origin main
    
    # Create and switch to hotfix branch
    git checkout -b "hotfix/$branch_name"
    log_success "Created and switched to hotfix/$branch_name"
}

# Smart commit with conventional format
smart_commit() {
    local type="$1"
    local message="$2"
    
    if [[ -z "$type" ]] || [[ -z "$message" ]]; then
        log_error "Commit type and message required"
        echo "Usage: $0 commit <type> <message>"
        echo "Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore"
        exit 1
    fi
    
    check_git_repo
    
    # Check for staged changes
    if ! git diff --staged --quiet; then
        # Create conventional commit
        git commit -m "${type}: ${message}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
        log_success "Committed with conventional format"
    else
        log_warning "No staged changes to commit"
    fi
}

# Stage CI/CD related files
stage_cicd_files() {
    check_git_repo
    
    log_info "Staging CI/CD related files..."
    
    # Stage workflow files
    git add .github/ 2>/dev/null || true
    
    # Stage documentation
    git add docs/ 2>/dev/null || true
    
    # Stage scripts
    git add scripts/ 2>/dev/null || true
    
    # Stage configuration files
    git add turbo.json 2>/dev/null || true
    git add sonar-project.properties 2>/dev/null || true
    git add package.json 2>/dev/null || true
    git add pnpm-lock.yaml 2>/dev/null || true
    
    # Stage tool configs
    git add tools/ 2>/dev/null || true
    
    log_success "Staged CI/CD files"
    git status --porcelain
}

# Create pull request using GitHub CLI
create_pull_request() {
    local title="$1"
    local description="$2"
    
    if [[ -z "$title" ]]; then
        log_error "Pull request title required"
        echo "Usage: $0 pr <title> [description]"
        exit 1
    fi
    
    check_git_repo
    
    # Check if gh CLI is available
    if ! command -v gh >/dev/null 2>&1; then
        log_error "GitHub CLI (gh) not installed"
        exit 1
    fi
    
    # Get current branch
    local current_branch=$(git branch --show-current)
    
    # Push current branch
    git push -u origin "$current_branch"
    
    # Create PR
    if [[ -n "$description" ]]; then
        gh pr create --title "$title" --body "$description"
    else
        gh pr create --title "$title" --body "Automated pull request for $current_branch"
    fi
    
    log_success "Pull request created"
}

# Sync with main branch
sync_with_main() {
    check_git_repo
    
    local current_branch=$(git branch --show-current)
    
    if [[ "$current_branch" == "main" ]]; then
        git pull origin main
        log_success "Updated main branch"
    else
        log_info "Syncing $current_branch with main..."
        
        # Fetch latest changes
        git fetch origin main
        
        # Rebase current branch on main
        git rebase origin/main
        
        log_success "Synced $current_branch with main"
    fi
}

# Clean up merged branches
cleanup_branches() {
    check_git_repo
    
    log_info "Cleaning up merged branches..."
    
    # Switch to main
    git checkout main
    git pull origin main
    
    # Delete merged branches
    git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d 2>/dev/null || true
    
    # Prune remote branches
    git remote prune origin
    
    log_success "Cleaned up merged branches"
}

# Show repository status
repo_status() {
    check_git_repo
    
    echo "🔍 Repository Status"
    echo "==================="
    echo
    
    # Current branch and status
    echo "Branch: $(git branch --show-current)"
    echo "Status: $(git status --porcelain | wc -l) changes"
    echo
    
    # Recent commits
    echo "Recent commits:"
    git log --oneline -5
    echo
    
    # Branches
    echo "Local branches:"
    git branch
    echo
    
    # Remote status
    if git remote -v | grep -q origin; then
        echo "Remote: $(git remote get-url origin)"
        
        # Check if behind/ahead of remote
        local ahead_behind=$(git rev-list --left-right --count origin/$(git branch --show-current)...HEAD 2>/dev/null || echo "0	0")
        local behind=$(echo "$ahead_behind" | cut -f1)
        local ahead=$(echo "$ahead_behind" | cut -f2)
        
        if [[ "$ahead" -gt 0 ]] && [[ "$behind" -gt 0 ]]; then
            echo "Status: $ahead ahead, $behind behind"
        elif [[ "$ahead" -gt 0 ]]; then
            echo "Status: $ahead ahead"
        elif [[ "$behind" -gt 0 ]]; then
            echo "Status: $behind behind"
        else
            echo "Status: up to date"
        fi
    fi
}

# Prepare release
prepare_release() {
    local version="$1"
    if [[ -z "$version" ]]; then
        log_error "Version required"
        echo "Usage: $0 release <version>"
        exit 1
    fi
    
    check_git_repo
    
    # Ensure we're on main and up to date
    git checkout main
    git pull origin main
    
    # Create release branch
    git checkout -b "release/$version"
    
    # Update version in package.json files if they exist
    if [[ -f "package.json" ]]; then
        log_info "Updating package.json version..."
        # This would need jq or sed to update the version
        log_warning "Manual version update required in package.json files"
    fi
    
    log_success "Release branch release/$version created"
    log_info "Next steps:"
    echo "1. Update version numbers in package.json files"
    echo "2. Update CHANGELOG.md"
    echo "3. Commit changes: $0 commit 'build' 'prepare release $version'"
    echo "4. Create PR: $0 pr 'Release $version' 'Prepare release $version'"
}

# Main function
main() {
    case "${1:-help}" in
        "feature")
            create_feature_branch "$2"
            ;;
        "hotfix")
            create_hotfix_branch "$2"
            ;;
        "commit")
            smart_commit "$2" "$3"
            ;;
        "stage")
            stage_cicd_files
            ;;
        "pr")
            create_pull_request "$2" "$3"
            ;;
        "sync")
            sync_with_main
            ;;
        "cleanup")
            cleanup_branches
            ;;
        "status")
            repo_status
            ;;
        "release")
            prepare_release "$2"
            ;;
        "help"|*)
            echo "🔧 Git Helper Scripts for CI/CD Pipeline"
            echo "======================================="
            echo
            echo "Usage: $0 <command> [arguments]"
            echo
            echo "Commands:"
            echo "  feature <name>     - Create feature branch"
            echo "  hotfix <name>      - Create hotfix branch"
            echo "  commit <type> <msg> - Smart conventional commit"
            echo "  stage              - Stage CI/CD related files"
            echo "  pr <title> [desc]  - Create pull request"
            echo "  sync               - Sync with main branch"
            echo "  cleanup            - Clean up merged branches"
            echo "  status             - Show repository status"
            echo "  release <version>  - Prepare release branch"
            echo "  help               - Show this help"
            echo
            echo "Examples:"
            echo "  $0 feature auth-improvements"
            echo "  $0 commit feat 'add new authentication system'"
            echo "  $0 pr 'Add authentication' 'Implements OAuth2 login'"
            echo "  $0 release v1.2.0"
            ;;
    esac
}

main "$@"
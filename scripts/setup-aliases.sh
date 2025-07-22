#!/bin/bash

# Setup shell aliases for CI/CD pipeline commands
# This script adds useful aliases to your shell configuration

# Detect shell
SHELL_NAME=$(basename "$SHELL")
case "$SHELL_NAME" in
    "zsh")
        RC_FILE="$HOME/.zshrc"
        ;;
    "bash")
        RC_FILE="$HOME/.bashrc"
        ;;
    *)
        echo "Unsupported shell: $SHELL_NAME"
        echo "Please manually add aliases to your shell configuration file"
        exit 1
        ;;
esac

echo "🔧 Setting up CI/CD aliases for $SHELL_NAME"
echo "Adding aliases to: $RC_FILE"

# Backup existing RC file
cp "$RC_FILE" "$RC_FILE.backup.$(date +%s)" 2>/dev/null || true

# Add aliases section
cat >> "$RC_FILE" << 'EOF'

# ============================================================================
# Sabron Trip Sync CI/CD Aliases
# ============================================================================

# Development shortcuts
alias dev='pnpm dev'
alias build='pnpm build'
alias test='pnpm test'
alias testci='pnpm test:ci'
alias lint='pnpm lint'
alias lintfix='pnpm lint:fix'
alias check='pnpm check'
alias qcheck='pnpm quality-check'

# Turbo shortcuts
alias tb='pnpm turbo run build'
alias tt='pnpm turbo run test'
alias tl='pnpm turbo run lint'
alias tc='pnpm turbo run typecheck'
alias td='pnpm turbo run dev'

# Database shortcuts
alias dbgen='pnpm db:generate'
alias dbmig='pnpm db:migrate'
alias dbseed='pnpm db:seed'
alias dbstudio='pnpm db:studio'

# Docker shortcuts
alias dkb='pnpm docker:build'
alias dku='pnpm docker:up'
alias dkd='pnpm docker:down'

# CI/CD helper shortcuts
alias cisetup='pnpm ci:setup'
alias cicheck='pnpm ci:check'
alias ciclean='pnpm ci:clean'
alias cianalyze='pnpm ci:analyze'

# Git helper shortcuts
alias gfeat='pnpm git:feature'
alias gcom='pnpm git:commit'
alias gsync='pnpm git:sync'
alias gstat='pnpm git:status'
alias gpr='pnpm git:pr'
alias gclean='pnpm git:cleanup'

# Standard git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline -10'
alias gd='git diff'
alias gds='git diff --staged'
alias gb='git branch'
alias gco='git checkout'

# GitHub CLI shortcuts
alias ghpr='gh pr create'
alias ghst='gh pr status'
alias ghwf='gh workflow list'
alias ghrun='gh run list'

# Package management shortcuts
alias pi='pnpm install'
alias pa='pnpm add'
alias pr='pnpm remove'
alias pu='pnpm update'
alias po='pnpm outdated'

# Utility functions
cdproject() {
    cd "$(git rev-parse --show-toplevel)" 2>/dev/null || echo "Not in a git repository"
}

# Quick project status
pstatus() {
    echo "🔍 Project Status"
    echo "================"
    echo "Node: $(node --version)"
    echo "pnpm: $(pnpm --version)"
    echo "Turbo: $(pnpm turbo --version)"
    echo "Git: $(git --version)"
    echo ""
    pnpm git:status
}

# Quick quality check
qc() {
    echo "🧪 Running Quality Checks"
    echo "========================="
    pnpm ci:check
}

# Project setup
psetup() {
    echo "🚀 Project Setup"
    echo "================"
    pnpm ci:setup
}

EOF

echo "✅ Aliases added successfully!"
echo ""
echo "To start using the aliases, either:"
echo "1. Restart your terminal"
echo "2. Run: source $RC_FILE"
echo ""
echo "Available aliases:"
echo "  dev, build, test, lint, check    - Development commands"
echo "  tb, tt, tl, tc, td               - Turbo shortcuts"
echo "  dbgen, dbmig, dbseed, dbstudio   - Database commands"
echo "  cisetup, cicheck, ciclean        - CI/CD helpers"
echo "  gfeat, gcom, gsync, gstat        - Git helpers"
echo "  gs, ga, gc, gp, gl              - Standard git shortcuts"
echo ""
echo "Available functions:"
echo "  cdproject                        - Go to project root"
echo "  pstatus                          - Show project status"
echo "  qc                              - Quick quality check"
echo "  psetup                          - Project setup"
echo ""
echo "Backup created at: $RC_FILE.backup.$(date +%s)"
# Claude Commands Directory

This directory contains organized command templates for Claude Code to help with various development tasks. Commands are organized by category for easy access and maintenance.

## Directory Structure

```
commands/
├── development/       # Code development and maintenance commands
├── project-management/ # Project planning and management commands
├── design/           # UI/UX and design-related commands
├── testing/          # Testing and quality assurance commands
├── analysis/         # Code and project analysis commands
└── README.md         # This file
```

## Command Categories

### 🛠️ Development (`/development`)
- **auth-setup.md** - Initialize authentication system with type safety
- **code-explain.md** - Detailed code explanations for novices and experts
- **debug.md** - Debug code issues with 20+ years of experience approach
- **documentation.md** - Generate comprehensive code documentation
- **hasura.md** - Hasura-specific development commands
- **refactor.md** - Code refactoring and optimization
- **test-suite.md** - Create comprehensive test suites

### 📊 Project Management (`/project-management`)
- **brief-generator.md** - Generate project briefs
- **development-plan.md** - Create detailed development plans
- **product-management.md** - Product management tasks (market research, pricing, etc.)
- **project-blueprint.md** - Comprehensive project blueprints
- **research-plan.md** - Research planning and execution
- **strategy.md** - Project management strategies
- **workflow.md** - Workflow creation and optimization

### 🎨 Design (`/design`)
- **brand-alignment.md** - Brand-aligned design systems
- **customer-personas.md** - Create detailed customer personas
- **develop-customer-personas.md** - Develop existing personas further
- **guidelines.md** - Design guidelines documentation
- **ui-personas.md** - UI-specific user personas
- **user-journey.md** - User journey mapping

### 🧪 Testing (`/testing`)
- **diagnostics.md** - Run comprehensive diagnostics
- **test-automation.md** - Test automation setup
- **test-to-code.md** - Convert tests to code implementation

### 🔍 Analysis (`/analysis`)
- **authentication.md** - Analyze authentication systems
- **codebase.md** - Comprehensive codebase analysis
- **issues.md** - Issue tracking and analysis
- **summary.md** - Generate project summaries

## Usage

To use a command, type the forward slash (/) followed by the command name. For example:
- `/debug` - Access the debugging command
- `/codebase` - Run codebase analysis
- `/customer-personas` - Create customer personas

## Command Naming Conventions

- Use descriptive, action-oriented names
- Keep names concise but clear
- Use hyphens for multi-word commands
- Group related commands in appropriate directories

## Adding New Commands

When adding new commands:
1. Place them in the appropriate category directory
2. Use the `.md` extension
3. Follow the existing naming conventions
4. Update this README with the new command

## Best Practices

1. **Keep commands focused** - Each command should do one thing well
2. **Use placeholders** - Use `{{VARIABLE}}` syntax for user inputs
3. **Provide context** - Include role descriptions and clear instructions
4. **Structure output** - Use consistent output formatting with tags
5. **Include examples** - Where applicable, provide usage examples
# glam-lavish - Claude Context

## Quick Stack Reference

- **Backend**: NestJS
- **Frontend**: React
- **Database**: PostgreSQL
- **Deployment**: Docker

## Project Structure

```
glam-lavish/
├── backend/                    # NestJS API (port 8040)
├── frontend/                   # React Web (port 8041)
├── dashboard/                  # Admin Dashboard (port 8042)
├── .claude/                    # Framework-specific skills & agents
└── docker-compose.yml          # Service orchestration
```

## Core BASH Tools (MANDATORY)

**Pattern Search - USE 'rg' ONLY:**
```bash
rg -n "pattern" --glob '!node_modules/*'  # Search with line numbers
rg -l "pattern"                            # List matching files
rg -t py "pattern"                         # Search Python files only
```

**File Finding - USE 'fd' ONLY:**
```bash
fd filename                  # Find by name
fd -e py                     # Find Python files
fd -H .env                   # Include hidden files
```

**Bulk Operations - ONE command > many edits:**
```bash
rg -l "old" | xargs sed -i '' 's/old/new/g'
```

**Preview - USE 'bat':**
```bash
bat -n filepath              # With line numbers
bat -r 10:50 file            # Lines 10-50
```

**JSON - USE 'jq':**
```bash
jq '.dependencies | keys[]' package.json
```

## Essential Commands

| Category | Command | Purpose |
|----------|---------|---------|
| **Git** | /commit | Commit main project, create PR to dev |
| | /commit-all | Commit all including submodules |
| | /pull | Pull latest from dev |
| **Dev** | /new-project | Create new project with boilerplate |
| | /fix-ticket | Analyze and fix Notion ticket |
| | /fullstack | Run autonomous dev loops |
| **Design** | /prd-to-design-prompts | Convert PRD to Aura prompts |
| | /prompts-to-aura | Execute prompts on Aura.build |

## Active Agents

| Agent | Location | Trigger Condition |
|-------|----------|-------------------|
| backend-developer | .claude/agents/ | Backend code changes |
| frontend-developer | .claude/agents/ | Frontend code changes |
| database-designer | .claude/agents/ | Schema design needed |
| design-qa-agent | .claude/react/agents/ | UI component work |

## Documentation Reference

| Document | Path | Purpose |
|----------|------|---------|
| Knowledge | .claude-project/docs/PROJECT_KNOWLEDGE.md | Full architecture & tech stack |
| API | .claude-project/docs/PROJECT_API.md | Endpoint specifications |
| Database | .claude-project/docs/PROJECT_DATABASE.md | Schema & ERD |
| Integration | .claude-project/docs/PROJECT_API_INTEGRATION.md | Frontend-API mapping |
| Design System | .claude-project/docs/PROJECT_DESIGN_GUIDELINES.md | Component styling |
| PRD | .claude-project/prd/prd.pdf | Original requirements |
| HTML Screens | .claude-project/resources/HTML/ | Prototype screens |

## Framework Resources

| Framework | Path | Description |
|-----------|------|-------------|
| NestJS | .claude/nestjs/guides/ | 20+ development guides |
| React | .claude/react/docs/ | 22 React guides |

## Plan Mode Reference

When planning implementation, ALWAYS consult these resources:

### Frontend Planning (React)
1. `.claude/react/docs/file-organization.md` — Directory structure, naming, imports
2. `.claude/react/docs/best-practices.md` — Coding standards
3. `.claude/react/docs/crud-operations.md` — Service/slice/mutation patterns
4. `.claude/agents/frontend-developer.md` — Full agent spec with quality checklist

### Backend Planning (NestJS)
1. `.claude/nestjs/guides/best-practices.md` — Critical rules, architecture
2. `.claude/nestjs/guides/database-patterns.md` — ORM patterns
3. `.claude/nestjs/guides/routing-and-controllers.md` — Controller patterns
4. `.claude/agents/backend-developer.md` — Full agent spec

### Always Reference
- `.claude-project/docs/PROJECT_API.md` — API endpoints
- `.claude-project/docs/PROJECT_API_INTEGRATION.md` — Frontend-API mapping
- `.claude-project/docs/PROJECT_DESIGN_GUIDELINES.md` — Design system
- `.claude-project/docs/PROJECT_DATABASE.md` — Database schema & ERD
- `.claude-project/docs/PROJECT_KNOWLEDGE.md` — Architecture & tech stack
- `.claude-project/prd/prd.pdf` — Source of truth

---

**Last Updated:** 2026-03-15

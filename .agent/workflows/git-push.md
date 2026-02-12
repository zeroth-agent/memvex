---
description: How to commit and push changes (user must approve the push)
---

# Git Commit and Push Workflow

This workflow stages, commits, and pushes changes. The push step always requires user approval.

## Steps

1. Stage all changes:
// turbo
```bash
git add -A
```

2. Review what's staged:
// turbo
```bash
git status --short
```

3. Commit with a conventional commit message:
```bash
git commit -m "<type>: <description>"
```

**Commit types:**
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code refactoring
- `chore:` — Maintenance / tooling
- `test:` — Adding or updating tests

4. Push to remote (ALWAYS requires user approval — never auto-run):
```bash
git push origin <branch>
```

> **Important**: Step 4 must NEVER be auto-run. Always wait for user approval before pushing.

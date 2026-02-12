# Contributing to Memvex

Thank you for your interest in contributing to Memvex! We welcome contributions of all kinds.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `pnpm install`
4. **Build** the project: `pnpm build`

## Development Workflow

```bash
# Create a feature branch
git checkout -b feat/my-feature

# Make your changes, then build
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, descriptive commits
3. Ensure the project builds (`pnpm build`) and tests pass (`pnpm test`)
4. Submit a Pull Request with a clear description of the changes

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — A new feature
- `fix:` — A bug fix
- `docs:` — Documentation changes
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

## Project Structure

```
packages/
  core/        — Config loader, types, logger, error classes
  identity/    — Identity management and preference serving
  memory/      — Cross-agent memory routing
  guard/       — Action-level permissions and approval queue
  mcp-server/  — MCP server exposing all modules as tools
  dashboard/   — Local web UI
cli/           — CLI tool (memvex init, serve, status, etc.)
```

## Reporting Issues

- Use the **Bug Report** template for bugs
- Use the **Feature Request** template for new ideas
- For security vulnerabilities, see [SECURITY.md](SECURITY.md)

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

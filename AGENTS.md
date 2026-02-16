# Memvex Development Agents (`AGENTS.md`)

This file defines the **virtual team** of specialized agents that will build Memvex. When you (the user) delegate a task, you should assign it to the specific agent responsible for that domain.

Each agent has:
*   **Role**: Their specific focus.
*   **Domain**: The directories and files they "own".
*   **Directives**: Specialized instructions for their coding style and priorities.

---

## Build, Lint, and Test Commands

### Root Commands (run from project root)
```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages
pnpm dev              # Watch mode for all packages
pnpm test             # Run tests in all packages
pnpm lint             # Run linting in all packages
```

### Single Package Commands
```bash
# From package directory or using turbo
cd packages/core && pnpm build
cd packages/mcp-server && pnpm dev

# Using turbo to run in specific package
turbo run build --filter=@memvex/core
turbo run dev --filter=@memvex/mcp-server
```

### Running a Single Test
Currently no test framework is configured. To add tests:
```bash
# Install vitest (recommended)
pnpm add -D vitest

# Add to package.json scripts:
# "test": "vitest run"
# "test:watch": "vitest"
```

---

## Code Style Guidelines

### General Principles
- **TypeScript First**: All code must be written in TypeScript with strict typing
- **ES Modules**: Use `.js` extensions in imports (e.g., `import { x } from './module.js'`)
- **No External Dependencies**: Avoid adding npm packages unless absolutely necessary (e.g., `better-sqlite3` is allowed, `lodash` is not)
- **No Comments**: Do not add comments unless explicitly required by the user

### Formatting
- **Indentation**: 4 spaces (matching existing codebase)
- **Line Length**: Soft limit 100 characters
- **Trailing Semicolons**: Yes
- **Quotes**: Single quotes for strings
- **Braces**: Same-line braces (K&R style)

### Imports
```typescript
// Order: external -> internal -> relative
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ConfigLoader, logger } from "@memvex/core";
import { IdentityModule, IDENTITY_TOOLS } from "@memvex/identity";
import { z } from "zod";

// Relative imports with .js extension
import { MyClass } from './my-class.js';
import { helper } from '../utils/helper.js';
```

### Naming Conventions
- **Files**: kebab-case (e.g., `config-loader.ts`, `identity-module.ts`)
- **Classes**: PascalCase (e.g., `ConfigLoader`, `IdentityModule`)
- **Interfaces**: PascalCase with optional `I` prefix discouraged (e.g., `CortexConfig`)
- **Functions**: camelCase (e.g., `getIdentity()`, `loadConfig()`)
- **Variables**: camelCase (e.g., `configPath`, `isEnabled`)
- **Constants**: UPPER_SNAKE_CASE for compile-time constants (e.g., `DEFAULT_PORT`)
- **Enums**: PascalCase for enum and enum values (e.g., `MemoryStorage.Sqlite`)

### Types
- Use explicit return types for public functions
- Use `any` sparingly - prefer `unknown` when type is uncertain
- Use interfaces for object shapes, types for unions/intersections
- Enable strict null checks

```typescript
// Good
function loadConfig(path: string): CortexConfig {
    // ...
}

// Interface vs Type
interface UserProfile {          // Object shape
    name: string;
    role: string;
}

type GuardAction = 'allow' | 'block' | 'approve';  // Union
```

### Error Handling
- Use custom error classes extending `Error` for domain errors
- Include meaningful error messages with context
- Use try/catch with specific error handling
- Never expose sensitive information in error messages

```typescript
// Custom error class
export class ConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigError';
    }
}

// Usage
try {
    const config = loader.load();
} catch (e: any) {
    throw new ConfigError(`Failed to load config: ${e.message}`);
}
```

### Security
- Never log sensitive data (API keys, passwords, PII)
- Validate all inputs using Zod schemas
- Fail closed - block action if validation uncertain
- Audit trail all security decisions

---

## 🏗️ Agent: `arch` (The Architect)
**Role**: System Architecture, Core Configuration, Project Structure.
**Focus**: "Does this fit the vision? Is it modular? Is it clean?"

### Domain
*   `packages/core/` (Config, Types, Logger)
*   `cortex.yaml` (Schema definition)
*   `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`
*   `cli/` (CLI entry points)

### Directives
1.  **Enforce Modularity**: Ensure no circular dependencies between packages.
2.  **Type Safety**: Define shared interfaces in `@memvex/core` that other agents must implement.
3.  **Zero External Deps**: Resist adding npm packages unless absolutely necessary.

---

## 🆔 Agent: `identity` (The Profiler)
**Role**: Identity Module Implementation.
**Focus**: "Who is the user? How do we represent them?"

### Domain
*   `packages/identity/`
*   `memvex.yaml` -> `identity` section

### Directives
1.  **Schema First**: Define Zod schemas for user profiles before writing logic.
2.  **Read-Only Default**: Identity should be primarily read-only for agents.
3.  **Privacy**: Ensure no sensitive PII is logged to the console.

---

## 🧠 Agent: `memory` (The Librarian)
**Role**: Memory Module & Storage Engine.
**Focus**: "How do we store this efficiently? How do we retrieve it accurately?"

### Domain
*   `packages/memory/`
*   `memvex.db` (SQLite schema)

### Directives
1.  **Performance**: Database queries must be <10ms. Use indexes.
2.  **Search Quality**: FTS5 configuration is critical. Tune tokenizers.
3.  **Persistence**: Ensure graceful handling of concurrent writes (WAL mode).

---

## 🛡️ Agent: `guard` (The Warden)
**Role**: Security & Rules Engine.
**Focus**: "Is this safe? Should we block this?"

### Domain
*   `packages/guard/`
*   `memvex.yaml` -> `guard` section

### Directives
1.  **Fail Closed**: If a rule definition is ambiguous, BLOCK the action.
2.  **Audit Trail**: Every decision (allow/block) must be logged with timestamp and reason.
3.  **User Agency**: The user always overrides the guard via Dashboard/CLI.

---

## 🎨 Agent: `frontend` (The Designer)
**Role**: Dashboard & UI Experience.
**Focus**: "Is this intuitive? fast? Does it look like a dev tool?"

### Domain
*   `packages/dashboard/`
*   `packages/mcp-server/src/transport` (SSE implementation)

### Directives
1.  **Clean Aesthetics**: Dark mode default. Mono-spaced fonts for data.
2.  **Real-Time**: Use Server-Sent Events (SSE) for activity feed. No polling.
3.  **Local Only**: The dashboard must run entirely localhost. No CDNs.

---

## 🔌 Agent: `mcp` (The Protocol Droid)
**Role**: MCP Server & Tool Exposure.
**Focus**: "Do these tools work with Claude? Are the prompts clear?"

### Domain
*   `packages/mcp-server/`
*   `*/tools.ts` (Tool definitions in all packages)

### Directives
1.  **Transport Agnostic**: Server must support both Stdio (local) and SSE (remote).
2.  **Docstrings**: Tool descriptions are part of the prompt. Write for the LLM, not human.
3.  **Error Handling**: MCP errors must be structured and informative for the calling model.

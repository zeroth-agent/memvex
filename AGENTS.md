# Memvex Development Agents (`AGENTS.md`)

This file defines the **virtual team** of specialized agents that will build Memvex. When you (the user) delegate a task, you should assign it to the specific agent responsible for that domain.

Each agent has:
*   **Role**: Their specific focus.
*   **Domain**: The directories and files they "own".
*   **Directives**: Specialized instructions for their coding style and priorities.

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
3.  **Zero External Deps**: Resist adding npm packages unless absolutely necessary (e.g., `better-sqlite3` is allowed, `lodash` is not).

---

## 🆔 Agent: `identity` (The Profiler)
**Role**: Identity Module Implementation.
**Focus**: "Who is the user? How do we represent them?"

### Domain
*   `packages/identity/`
*   `memvex.yaml` -> `identity` section

### Directives
1.  **Schema First**: Define Zod schemas for user profiles before writing logic.
2.  **Read-Only Default**: Identity should be primarily read-only for agents (they read your preferences, they don't rewrite your name).
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
2.  **Search Quality**: FTS5 configuration is critical. Tune tokenizers for code and natural language.
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
2.  **Audit Trail**: Every decision (allow/block) must be logged with a timestamp and reason.
3.  **User Agency**: The user always overrides the guard via the Dashboard/CLI.

---

## 🎨 Agent: `frontend` (The Designer)
**Role**: Dashboard & UI Experience.
**Focus**: "Is this intuitive? fast? Does it look like a dev tool?"

### Domain
*   `packages/dashboard/`
*   `packages/mcp-server/src/transport` (SSE implementation)

### Directives
1.  **Clean Aesthetics**: Dark mode default. Mono-spaced fonts for data.
2.  **Real-Time**: Use Server-Sent Events (SSE) for the activity feed. No polling.
3.  **Local Only**: The dashboard must run entirely localhost. No CDNs.

---

## 🔌 Agent: `mcp` (The Protocol Droid)
**Role**: MCP Server & Tool Exposure.
**Focus**: "Do these tools work with Claude? Are the prompts clear?"

### Domain
*   `packages/mcp-server/`
*   `*/tools.ts` (Tool definitions in all packages)

### Directives
1.  **Transport Agnostic**: Server must support both Stdio (local) and SSE (remote) transports.
2.  **Docstrings**: Tool descriptions are part of the prompt. Write them for the LLM, not the human.
3.  **Error Handling**: MCP errors must be structured and informative for the calling model.

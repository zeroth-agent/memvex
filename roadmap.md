# Memvex: Project Roadmap

This roadmap outlines the plan to build **Memvex** (formerly Cortex) over a 4-week timeline. The project is a personal runtime for AI agents, providing Identity, Memory, and Guard services via an MCP server.

## Overview

**Goal**: Create a cohesive, self-hosted, local-first runtime that makes AI agents personalized, context-aware, and safe.
**Stack**: TypeScript, Node.js, SQLite, React (Dashboard), MCP Protocol.

---

## Phase 1: Core Foundation & Identity (Week 1)
**Objective**: Build the skeleton, configuration system, and the first module (Identity) so agents know *who* you are.

### Week 1 Deliverables
- **Monorepo Setup**:
  - Pnpm workspace configuration.
  - Turborepo setup for efficient builds.
  - TypeScript config (`tsconfig.base.json`).
- **Core Package (`@memvex/core`)**:
  - `ConfigLoader`: Validates `memvex.yaml` using Zod schemas.
  - `Logger`: Structured logging with levels.
  - `ModuleRegistry`: Interface for Identity, Memory, and Guard modules.
- **Identity Module (`@memvex/identity`)**:
  - Reads `identity` section from `memvex.yaml`.
  - Exposes `identity.get(key)` API.
  - **MCP Tools**: `identity_get`, `identity_list`.
- **MCP Server (`@memvex/mcp-server`)**:
  - Basic MCP server implementation using `@modelcontextprotocol/sdk`.
  - Stdio transport for local clients (Claude Desktop, Cursor).
- **CLI (`memvex`)**:
  - `memvex init`: Interactive setup wizard.
  - `memvex serve`: Starts the MCP server.

### Verification Plan
- `memvex init` successfully creates `memvex.yaml`.
- `memvex serve` starts cleanly.
- Claude Desktop can connect and query `identity_get("coding.style")`.

---

## Phase 2: Memory Module (Week 2)
**Objective**: Enable agents to remember context across sessions using a shared knowledge store.

### Week 2 Deliverables
- **Memory Module (`@memvex/memory`)**:
  - **Storage**: SQLite database (`better-sqlite3`) for storing memory entries.
  - **Schema**: Unique ID, timestamps, content, metadata (tags, source), expiration (TTL).
  - **Search**: FTS5 full-text search implementation for fast retrieval.
- **MCP Tools**:
  - `memory_store(content, tags)`: Save information.
  - `memory_recall(query)`: Retrieve relevant context based on query.
  - `memory_forget(id)`: Remove specific memories.
- **CLI Commands**:
  - `memvex memory list`: View recent memories.
  - `memvex memory recall "query"`: Test search from terminal.

### Verification Plan
- Agent A stores a memory ("User prefers dark mode").
- Agent B (later session) recalls "preferences" and retrieves "User prefers dark mode".
- Performance check: Recall < 50ms on local DB.

---

## Phase 3: Guard Module (Week 3)
**Objective**: Implement safety rails and approval workflows for high-stakes actions.

### Week 3 Deliverables
- **Guard Module (`@memvex/guard`)**:
  - **Rules Engine**: Parses `guard` section in `memvex.yaml`. Matches actions against policies (allow, block, require_approval).
  - **Approval Queue**: Stores pending approval requests in SQLite.
- **MCP Tools**:
  - `guard_check(action, params)`: Returns `allowed`, `blocked`, or `pending_approval`.
  - `guard_request_approval(id, reason)`: Initiates an approval flow.
- **CLI Commands**:
  - `memvex guard pending`: List validation requests.
  - `memvex guard approve <id>` / `deny <id>`: Manage approvals.

### Verification Plan
- Tool call `guard_check("spend_money", {amount: 100})` correctly triggers approval flow if rule exists.
- Agent gets paused/blocked response until human approves via CLI.

---

## Phase 4: Dashboard & Polish (Week 4)
**Objective**: Provide a visual interface for monitoring agent activity and managing config.

### Week 4 Deliverables
- **Dashboard Package (`@memvex/dashboard`)**:
  - React + Vite SPA.
  - **Tabs**:
    - **Activity Feed**: Real-time log of agent interactions (via SSE).
    - **Identity**: Visual editor for `memvex.yaml`.
    - **Memory Explorer**: Search and browse stored memories.
    - **Approvals**: UI for approving/rejecting Guard requests.
- **Documentation**:
  - `README.md`: Polished with demo GIF and quickstart.
  - `docs/`: Detailed API reference and configuration guide.
- **Launch Preparation**:
  - CI/CD workflows for testing and publishing.
  - Release 1.0.0 on npm.

### Verification Plan
- Dashboard loads at `localhost:3000`.
- Real-time updates appear in Activity Feed when agents use tools.
- Approvals can be handled via UI.

# Architecture

Memvex is structured as a monorepo with five core packages, a CLI, and a dashboard.

## System Overview

```
┌─────────────────────────────────────────────────┐
│                  MCP Clients                     │
│         (Claude, Cursor, Windsurf, ...)          │
└──────────────────────┬──────────────────────────┘
                       │ MCP Protocol (stdio)
┌──────────────────────▼──────────────────────────┐
│              @memvex/mcp-server                  │
│          Registers tools, handles requests       │
├──────────────────────────────────────────────────┤
│                  @memvex/core                    │
│        Config loader · Logger · Types            │
├────────────┬─────────────┬───────────────────────┤
│  @memvex/  │  @memvex/   │     @memvex/          │
│  identity  │  memory     │     guard             │
│            │             │                       │
│ "Who am I?"│"What do I   │ "What can I do?"      │
│            │  know?"     │                       │
└────────────┴─────────────┴───────────────────────┘
```

## Packages

### `@memvex/core`
The kernel. Loads `memvex.yaml`, provides shared types (`CortexConfig`, `IdentityConfig`, `MemoryConfig`, `GuardConfig`), a structured logger, and an error hierarchy.

### `@memvex/identity`
Serves user identity and preferences. Supports dot-notation queries (e.g. `coding.style` → `"functional"`). Exposed via the `identity_get` MCP tool.

### `@memvex/memory`
Cross-agent memory routing. Defines a `MemoryBackend` interface that can wrap SQLite, Mem0, Letta, or other backends. Currently ships with `InMemoryStore` for development. Exposed via `memory_store`, `memory_recall`, `memory_forget` MCP tools.

### `@memvex/guard`
Action-level permissions engine. The `RulesEngine` evaluates guard rules (blocked, approval-required, threshold-based) and the `ApprovalQueue` manages pending human approvals. Exposed via `guard_check`, `guard_request_approval`, `guard_list_pending` MCP tools.

### `@memvex/mcp-server`
The MCP server that wires all modules together. Uses `@modelcontextprotocol/sdk` and communicates over stdio. This is what agents connect to.

### `@memvex/dashboard`
A local web UI (React + Vite) for managing your identity, browsing memories, and approving pending guard requests. *(Coming in Phase 4)*

### `cli`
Command-line tool: `memvex init`, `memvex serve`, `memvex status`, `memvex memory`, `memvex guard`.

## Design Principles

1. **Local-first**: All data stays on your machine. No cloud required.
2. **Pluggable backends**: Memory and guard use interfaces, not concrete implementations.
3. **MCP-native**: We ride the MCP standard for instant compatibility.
4. **Human-readable config**: `memvex.yaml` is designed to be `git diff`-able.
5. **Integrate, don't rebuild**: We abstract over existing tools (Mem0, Cerbos) rather than replacing them.

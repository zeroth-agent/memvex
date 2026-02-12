# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- [pnpm](https://pnpm.io/) v9 or later

## Installation

```bash
git clone https://github.com/zeroth-agent/memvex.git
cd memvex
pnpm install
pnpm build
```

## Quick Start

### 1. Initialize Your Config

```bash
memvex init
```

This creates a `memvex.yaml` file in your current directory. Edit it to define your identity, memory settings, and guard rules.

### 2. Start the MCP Server

```bash
memvex serve
```

The MCP server starts on stdio. Any MCP-compatible client (Claude Desktop, Cursor, etc.) can connect to it.

### 3. Connect an Agent

See the [integration guides](../examples/integrations/) for connecting:
- [Claude Desktop](../examples/integrations/claude-desktop.md)
- [Cursor](../examples/integrations/cursor.md)

## What Happens Next?

Once connected, your agents can:
- **Query your identity**: `identity_get("coding.style")` → `"functional"`
- **Store memories**: `memory_store("User prefers dark mode")` — available to all agents
- **Check permissions**: `guard_check("spend_money", { amount: 75 })` → requires approval

## Project Structure

```
memvex.yaml          ← Your personal config (the whole point)
packages/
  core/              ← Config loader, types, logger
  identity/          ← "Who am I?" module
  memory/            ← "What do I know?" cross-agent memory
  guard/             ← "What can I do?" action permissions
  mcp-server/        ← MCP server exposing all modules
  dashboard/         ← Local web UI (coming soon)
cli/                 ← CLI tool
```

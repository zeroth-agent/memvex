# Memvex Project Plan

This document tracks the progress of building Memvex (formerly Cortex), the personal runtime for AI agents.

## Phase 0: Meta-Structure (Current)
- [x] **Project Planning**
    - [x] Define Roadmap (`roadmap.md`)
    - [x] Define Implementation Plan (`implementation_plan.md`)
    - [x] Define Agent Config Standard (`agent_configuration_spec.md`)
    - [x] Define Development Agents (`AGENTS.md`)

## Phase 1: Core Foundation & Identity (Week 1)
- [x] **Scaffold Structure**
    - [x] Initialize monorepo (Turborepo)
    - [x] Create `packages/core` (Config, Types, Logger)
    - [x] Create `packages/identity` (Identity Module)
    - [x] Create `packages/mcp-server` (Basic Server)
    - [x] Create `cli` (Init, Serve, Status, Memory, Guard commands)
    - [x] Create `packages/dashboard` (Moved from site)
    - [x] Create `docs/` and `examples/` per spec
- [x] **Implement Core**
    - [x] Config loader (`memvex.yaml`)
    - [x] Module registry
- [x] **Implement Identity**
    - [x] Schema definition
    - [x] File-based storage/loading
    - [x] MCP Tools (`identity_get`, `identity_list`)
- [x] **CLI & MCP Server**
    - [x] `memvex init` command
    - [x] `memvex serve` command
    - [x] Connect Claude/Cursor to local server
- [x] Connect Claude/Cursor to local server

## Phase 1.5: Public Website (Week 1)
- [ ] **Data & Vision Site**
    - [x] Scaffold `packages/docs` (Astro Starlight)
    - [ ] Migrate `docs/*.md` content
    - [x] **Landing Page Migration**
        - [x] Port `cortex-landing.jsx` to `packages/docs/src/components/Landing.tsx`
        - [x] Rename "Cortex" -> "Memvex" in UI
        - [x] Integrate into `index.mdx` using Astro


- [ ] **Memory Package**
    - [ ] Create `packages/memory`
    - [ ] SQLite storage adapter (`better-sqlite3`)
    - [ ] FTS5 Full-text search
- [ ] **MCP Tools for Memory**
    - [ ] `memory_store`
    - [ ] `memory_recall`
    - [ ] `memory_forget`

## Phase 3: Guard Module (Week 3)
- [ ] **Guard Package**
    - [ ] Create `packages/guard`
    - [ ] Rules engine (YAML parser)
    - [ ] Approval queue (SQLite)
- [ ] **MCP Tools for Guard**
    - [ ] `guard_check`
    - [ ] `guard_request_approval`

## Phase 4: Dashboard & Polish (Week 4)
- [ ] **Web Dashboard**
    - [ ] Create `packages/dashboard` (React + Vite)
    - [ ] Activity Feed
    - [ ] Identity Editor
    - [ ] Approval UI
- [ ] **Documentation & Launch**
    - [ ] `docs/` site
    - [ ] Finalize `README.md`
    - [ ] Publish packages

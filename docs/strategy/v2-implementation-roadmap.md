# Memvex V2 Implementation Roadmap (Revised)

> Phased plan implementing all 10 competitive analysis solutions **plus** 8 critical gaps identified during self-review.
> Each phase ships as a usable release. Ordered by **unique value delivered**, not ease.

---

## Self-Review: What the Original Plan Was Missing

| # | Gap | Why It Matters |
|---|-----|---------------|
| 1 | **Identity is passive** — stored but never injected into AI conversations | Users get zero value from identity until the AI actually *uses* their preferences. The identity module is a read-only JSON blob. |
| 2 | **No MCP Resources** — only using MCP Tools, ignoring the Resources capability | MCP Resources let the AI automatically read user preferences without being asked. This is the "magic moment" — Claude just *knows* you. |
| 3 | **No memory types or importance scoring** — all memories are equal | "My API runs on port 3001" vs "I had coffee today" shouldn't have equal weight. Memory decay and typing (fact / preference / instruction / context) are essential. |
| 4 | **No encryption at rest** — memories stored as plaintext | Users won't store sensitive info in a tool with zero security. Optional encryption is a trust signal. |
| 5 | **No multi-agent memory isolation** — Mem0's known bug (#3998) | Memory bleeding between agents is a real problem. Memvex should solve this with strict agent-scoped namespaces. |
| 6 | **No Python SDK** — AI agent ecosystem is 80% Python | LangChain, CrewAI, AutoGen, Agno are all Python. Without a Python SDK, memvex only reaches the MCP/TypeScript niche. |
| 7 | **No Docker self-hosting** — "local-first" only works on dev machines | Docker is table stakes for self-hosted tools. One `docker run` command should spin up memvex with dashboard. |
| 8 | **No approval notifications** — pending approvals sit in a void | When a guardrail blocks something, there's no way to notify the user unless they're staring at the dashboard. Slack/webhook notifications are essential. |

---

## Revised Overview

| Phase | Name | Unique Value | Effort | Solutions Addressed |
|-------|------|-------------|--------|-------------------|
| **1** | Magic First Run | `npx memvex init` → value in 2 min | 1 week | CA #2, #9 + Gap #1, #2 |
| **2** | Enforceable Guard | Guardrails that actually block + notifications | 2 weeks | CA #1, #4 + Gap #8 |
| **3** | Intelligent Memory | Semantic search + memory types + importance | 1.5 weeks | CA #8 + Gap #3, #5 |
| **4** | Developer Experience | Full CLI + lightweight dashboard + encryption | 1 week | CA #10 + Gap #4 |
| **5** | Multi-Platform SDK | Python SDK + Docker + REST API | 1.5 weeks | Gap #6, #7 + CA #3 |
| **6** | OSS Infrastructure | CI/CD, automation, community | 3-4 days | CA #6 |
| **7** | Cross-Device Sync | Turso/libSQL + cloud sync | 1 week | CA #5 |
| **8** | Positioning & Launch | README, landing page, comparison | 3-4 days | CA #1, #3, #7 |

**Total: ~8-10 weeks**

---

## Phase 1: Magic First Run (CA #2, #9 + Gaps #1, #2)

> **Goal**: Install → "wow, Claude already knows me" in under 2 minutes.
> This is the make-or-break moment. If this isn't magical, nothing else matters.

### 1.1 — `memvex init` with Auto-Discovery

```bash
$ npx memvex init
> Scanning your environment...
> ✓ Found: Basil Hashil (from ~/.gitconfig)
> ✓ Stack: TypeScript, React, Vite (from package.json)
> ✓ Editor: VS Code (from $VISUAL)
> ✓ Style: 2-space indent (from .editorconfig)
> ✓ AI prefs: imported 12 rules from .cursorrules
> ✓ Created 9 seed memories
> ✓ Generated memvex.jsonc
>
> Add to Claude Desktop config:
> { "mcpServers": { "memvex": { "command": "npx", "args": ["memvex"] } } }
```

**New files:**

| File | Description |
|------|-------------|
| `packages/core/src/discovery.ts` | Environment scanner: git, package.json, editor, shell, AI configs |
| `packages/cli/src/commands/init.ts` | Interactive init with auto-detection |
| `packages/core/src/schema.json` | JSON Schema for `memvex.jsonc` |
| `packages/core/src/config-loader.ts` | MODIFY — JSONC + zero-config fallback chain |

### 1.2 — MCP Resources for Automatic Context Injection

**This is the killer feature.** Instead of the AI needing to call `identity_get`, expose identity as an MCP **Resource** that Claude reads automatically:

```typescript
// server.ts — register identity as MCP Resource
server.resource(
  "user-identity",
  "memvex://identity",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify(identityModule.getAll())
    }]
  })
);

// Also expose recent memories as context
server.resource(
  "recent-context",
  "memvex://context/recent",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "text/plain",
      text: formatRecentMemories(await memoryModule.list())
    }]
  })
);
```

**Result**: Claude automatically reads your identity and recent memories at the start of every conversation. No tool calls needed. The AI just *knows* you.

**Modified files:**

| File | Description |
|------|-------------|
| `packages/mcp-server/src/server.ts` | MODIFY — register Resources for identity + recent context |
| `packages/core/src/types.ts` | MODIFY — add config schema types |

### 1.3 — JSONC Config with Progressive Disclosure

| Level | Config | Use case |
|-------|--------|----------|
| 0 | None | Auto-detected defaults (works out of the box) |
| 1 | `memvex.jsonc` | Simple overrides with `$schema` IDE autocomplete |
| 2 | `memvex.config.ts` | `defineConfig()` for power users |

---

## Phase 2: Enforceable Guard (CA #1, #4 + Gap #8)

> **Goal**: Guardrails that actually block + notify you when something is waiting.

### 2.1 — MCP Elicitation (Real Enforcement)

```typescript
// guard tool handler
const violation = guardModule.check(action, params);
if (violation.requiresApproval) {
  // Actually PAUSE execution — user must approve in-client
  const response = await server.requestElicitation({
    message: `⚠️ ${violation.reason}`,
    requestedSchema: {
      type: "object",
      properties: {
        override: { type: "boolean", description: "Allow this action?" }
      }
    }
  });
  if (response.action !== "accept" || !response.content?.override) {
    return { blocked: true, reason: violation.reason };
  }
}
```

### 2.2 — MCP Proxy (`memvex-proxy`)

Wrap *any* MCP server with guardrails — zero code changes:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "memvex-proxy",
      "args": ["--rules", "guardrails.jsonc", "--", "npx", "@modelcontextprotocol/server-filesystem"]
    }
  }
}
```

**New package:**

| File | Description |
|------|-------------|
| `packages/proxy/src/proxy.ts` | stdio MCP proxy, intercepts tool calls |
| `packages/proxy/src/interceptor.ts` | Rule evaluation on intercepted calls |
| `packages/proxy/src/policy.ts` | Policy-as-code engine (JSON rule definitions) |
| `packages/proxy/bin/memvex-proxy.ts` | CLI entry point |

### 2.3 — Approval Notifications

When a guardrail blocks something, notify the user:

```jsonc
// memvex.jsonc
{
  "notifications": {
    "webhook": "https://hooks.slack.com/services/...",  // Slack
    "desktop": true   // Native OS notification
  }
}
```

| File | Description |
|------|-------------|
| `packages/guard/src/notifier.ts` | NEW — webhook + desktop notification sender |
| `packages/guard/src/audit.ts` | NEW — SQLite audit log for all guard evaluations |

---

## Phase 3: Intelligent Memory (CA #8 + Gaps #3, #5)

> **Goal**: Not just storage — smart memory with types, importance, semantic search, and agent isolation.

### 3.1 — Memory Types and Importance

```typescript
interface MemoryEntry {
  id: string;
  content: string;
  type: 'fact' | 'preference' | 'instruction' | 'context' | 'episode';
  importance: number;       // 0.0 - 1.0, auto-scored or user-set
  agent?: string;           // Which agent stored this
  namespace?: string;
  tags?: string[];
  accessCount: number;      // How often recalled
  lastAccessedAt?: string;  // For decay calculation
  createdAt: string;
  expiresAt?: string;
}
```

**Memory decay**: Memories that are never recalled gradually lose importance. Frequently accessed memories gain importance. This is how real human memory works.

**Auto-classification**: When an agent stores "always use TypeScript", classify it as `instruction` with high importance. When it stores "we discussed the API today", classify as `episode` with lower importance.

### 3.2 — Agent-Scoped Memory Isolation

Solve Mem0's memory bleeding bug (#3998):

```typescript
// Each agent has its own namespace by default
memory_store({ content: "...", agent: "coding-agent" })
// Only visible to coding-agent unless explicitly shared

memory_recall({ query: "...", agent: "coding-agent" })
// Only searches coding-agent's memories

memory_recall({ query: "...", shared: true })
// Searches across all agents (explicit opt-in)
```

### 3.3 — Semantic Search (Transformers.js + sqlite-vec)

```typescript
import { pipeline } from '@huggingface/transformers';

const embedder = await pipeline('feature-extraction',
  'Xenova/all-MiniLM-L6-v2', { dtype: 'q8' });
```

**Hybrid search**: Combine keyword `LIKE` matching (fast, exact) with vector similarity (semantic, fuzzy) for best results.

| File | Description |
|------|-------------|
| `packages/memory/src/embeddings.ts` | NEW — Transformers.js wrapper, lazy loading |
| `packages/memory/src/vector-store.ts` | NEW — sqlite-vec integration |
| `packages/memory/src/types.ts` | MODIFY — add `type`, `importance`, `accessCount` |
| `packages/memory/src/decay.ts` | NEW — importance decay algorithm |
| `packages/memory/src/classifier.ts` | NEW — auto-classify memory type |

---

## Phase 4: Developer Experience (CA #10 + Gap #4)

> **Goal**: CLI-first, lightweight dashboard, optional encryption.

### 4.1 — Comprehensive CLI

```bash
# Memory
memvex memories list [--namespace ns] [--type fact] [--limit 20]
memvex memories search "what port does our API use?"
memvex memories add "API runs on port 3001" --type fact --namespace work
memvex memories delete <id>
memvex memories export > backup.json
memvex memories import < backup.json

# Guard
memvex guard rules
memvex guard check "deploy to prod"
memvex guard pending / approve <id> / deny <id>
memvex guard audit [--last 50]

# Identity
memvex identity show / set name "Basil"

# System
memvex status / doctor / config show / config edit
```

### 4.2 — Lightweight Hono Dashboard

Replace React SPA with ~700 lines of Hono + embedded HTML. No build step.

### 4.3 — Encryption at Rest

```jsonc
{
  "security": {
    "encryption": true,
    "keySource": "env:MEMVEX_KEY"  // or "keychain" for OS keychain
  }
}
```

| File | Description |
|------|-------------|
| `packages/core/src/encryption.ts` | NEW — AES-256-GCM encrypt/decrypt |
| `packages/memory/src/encrypted-store.ts` | NEW — wraps any store with encryption |

---

## Phase 5: Multi-Platform SDK (Gaps #6, #7 + CA #3)

> **Goal**: Reach the Python/Docker audience. Not MCP-only.

### 5.1 — REST API Layer

```typescript
// packages/server/src/rest.ts
app.post('/v1/memory', async (req, res) => { /* ... */ });
app.post('/v1/guard/check', async (req, res) => { /* ... */ });
app.get('/v1/identity', (req, res) => { /* ... */ });
```

### 5.2 — Python SDK

```python
from memvex import Memvex

mx = Memvex(url="http://localhost:4983")

# Memory
mx.memory.store("API runs on port 3001", namespace="work")
results = mx.memory.recall("what port?")

# Guard
decision = mx.guard.check("deploy_to_prod")
if decision.blocked:
    print(f"Blocked: {decision.reason}")

# Identity
prefs = mx.identity.get("coding.style")
```

### 5.3 — Docker Self-Hosting

```bash
docker run -d -p 4983:4983 -v ~/.memvex:/data zerothagent/memvex
```

| File | Description |
|------|-------------|
| `packages/sdk-python/` | NEW — Python SDK package |
| `packages/server/src/rest.ts` | NEW — REST API alongside MCP |
| `Dockerfile` | NEW — Multi-stage build |
| `docker-compose.yml` | NEW — With optional Turso sync |

---

## Phase 6: OSS Infrastructure (CA #6)

> **Goal**: Automate everything so solo maintainer can scale.

| Asset | File |
|-------|------|
| CI/CD | `.github/workflows/ci.yml`, `.github/workflows/release.yml` |
| semantic-release | Auto-version + changelog + npm publish |
| Renovate | `renovate.json` — auto-update deps |
| Stale bot | 30-day timeout on issues |
| Community | `CONTRIBUTING.md`, `SECURITY.md`, issue/PR templates |
| Funding | GitHub Sponsors ($5/$25/$100 tiers) |

---

## Phase 7: Cross-Device Sync (CA #5)

> **Goal**: Turso/libSQL for cross-device memory + guardrails.

Swap `sql.js`/`better-sqlite3` with `@tursodatabase/sync`. Same data model, different driver. libSQL's native vector search replaces sqlite-vec.

```bash
memvex sync setup    # Configure Turso
memvex sync push     # Local → Cloud
memvex sync pull     # Cloud → Local
```

---

## Phase 8: Positioning & Launch (CA #1, #3, #7)

> **Goal**: "AI Agent Safety Memory" — the category Mem0 doesn't own.

| Deliverable | Description |
|------------|-------------|
| README rewrite | "Memory, identity, and guardrails — no cloud, no API keys" |
| Landing page | Interactive guardrails demo, comparison table |
| `npx memvex` | One-command setup, value in 2 min |
| Launch post | HN, Reddit, Twitter — lead with guardrails story |

---

## What Makes This Unique (vs Original Plan)

| Original Plan | Revised Plan | Why It Matters |
|--------------|-------------|---------------|
| Identity is read-only JSON | Identity auto-injected via MCP Resources | AI *knows* you without asking |
| All memories equal | Typed memories with importance + decay | Smart memory, not dumb storage |
| Basic keyword search | Hybrid semantic + keyword search | Actually finds what you need |
| Guardrails are advisory | Elicitation + proxy = real enforcement | "Block" means blocked |
| TypeScript/MCP only | Python SDK + REST API + Docker | 10x larger audience |
| No encryption | Optional AES-256-GCM at rest | Trust signal for sensitive data |
| No notifications | Slack/webhook/desktop notifications | Approvals don't sit in a void |
| No agent isolation | Agent-scoped namespaces | Solves Mem0's memory bleeding |

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Time from install to "wow" | < 2 minutes |
| Config file required | No |
| External API keys required | No |
| Guardrails enforce | Yes (elicitation + proxy) |
| Memory quality | Semantic search, typed, decay |
| Platform reach | MCP + REST + Python |
| Self-hostable | One `docker run` command |
| Solo-maintainer sustainable | Full CI/CD automation |
| Clear Mem0 differentiation | Memory + Identity + Guard |

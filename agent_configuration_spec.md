# Memvex Agent Configuration Standard (`memvex.yaml`)

To support true **Agentic Development**, the `memvex.yaml` file acts as the "operating system" for your agents. It transforms stateless LLM calls into personalized, context-aware, and safe agent interactions.

## Core Philosophy
1.  **Identity is Global**: Define it once, apply it to every agent (Claude, Cursor, custom scripts).
2.  **Context is Dynamic**: Agents need to know *what* you are working on right now, not just who you are.
3.  **Safety is Declarative**: Rules are defined as data, not code.

## Standard File Structure

The `memvex.yaml` file consists of three required sections: `identity`, `memory_policy`, and `guard`.

```yaml
# memvex.yaml v1
version: "1.0"

# ------------------------------------------------------------------
# IDENTITY: Who you are and how agents should behave.
# ------------------------------------------------------------------
identity:
  name: "User Name"
  role: "Senior Full-Stack Engineer"
  
  # Communication styles for different contexts
  communication:
    default: "concise, technical, no fluff"
    code_review: "constructive, pedagogical, focus on patterns"
    ideation: "creative, expansive, ask clarifying questions"

  # Coding preferences (consumed by coding agents)
  coding:
    languages:
      - typescript
      - rust
      - python
    style:
      ts: "functional, no classes unless necessary, z.infer for custom types"
      python: "type-hinted, google docstring style"
    preferences:
      - "Always prefer composition over inheritance"
      - "Use early returns to reduce nesting"
      - "Comments should explain 'why', not 'what'"

# ------------------------------------------------------------------
# CONTEXT: The "Working Memory" of the system.
# Agents check this to understand the current mission.
# ------------------------------------------------------------------
context:
  current_project: "Memvex"
  mission: "Build a local-first agent runtime in 4 weeks"
  active_constraints:
    - "No external cloud dependencies"
    - "Must run on low-end hardware (local LLMs)"

# ------------------------------------------------------------------
# MEMORY POLICY: How agents interact with the shared brain.
# ------------------------------------------------------------------
memory:
  # Auto-expiry for temporary knowledge
  default_ttl: "30d"
  
  # Namespaces allow logical separation of memories
  namespaces:
    - name: "personal"
      description: "Private life, hobbies, schedule"
    - name: "work"
      description: "Company projects, team dynamics"
      
  # What gets auto-indexed for search
  indexing:
    enabled: true
    provider: "local-fts" # or 'embeddings'

# ------------------------------------------------------------------
# GUARD: The Safety Layer.
# Agents MUST check these rules before sensitive actions.
# ------------------------------------------------------------------
guard:
  mode: "strict" # strict (block by default) or monitor (log only)
  
  rules:
    # Financial Safety
    - action: "spend_money"
      condition: "amount > 0"
      policy: "require_approval"
      message: "Human approval required for any spending."

    # Codebase Safety
    - action: "git_push"
      condition: "branch == 'main'"
      policy: "block"
      message: "Direct push to main is disabled. Use a PR."
      
    # Communication Safety
    - action: "send_email"
      condition: "recipient_domain != 'mycompany.com'"
      policy: "require_approval"
      
    # Tool-specific Rules
    - action: "fs_write"
      condition: "path.startsWith('/etc/') or path.startsWith('C:\\Windows')"
      policy: "block"

```

## Usage in Agentic Workflows

### 1. Initialization
When an agent starts, it MUST call `memvex.identity.get_all()` to seed its system prompt.
*   **Result**: The agent immediately adopts your persona and coding style.

### 2. Context Retrieval
Before starting a task, the agent calls `memvex.memory.recall(task_description)` to see if there is prior art or established patterns.
*   **Result**: The agent doesn't reinvent the wheel. It sees "Ah, we accepted a pattern for 'auth' last week" and reuses it.

### 3. Action Execution
Before executing a tool call (e.g., writing a file, making an API request), the agent calls `memvex.guard.check(action_name, params)`.
*   **Result**: The agent is prevented from hallucinating a destructive command or spending API credits without permission.

## Implementation Checklist
- [ ] Create `zod` schema for this YAML structure in `@memvex/core`.
- [ ] Implement `ConfigLoader` to parse and validate this file.
- [ ] Add `CLI` command to scaffold this default structure. 

# Memvex: The Personal Runtime for AI Agents

## The Opportunity: A Fragmented Landscape

The concept of a "Personal AI OS" exists in fragments, but no one has assembled the full picture. The three pillars—**Identity**, **Memory**, and **Guardrails**—have strong individual solutions (Mem0, Cerbos, etc.), but no unified runtime weaves them together into "you as an API" for all your agents.

### The Problem
*   **Identity is Fragmented**: No universal `me.json`. You have to configure `AGENTS.md`, `.cursorrules`, and custom prompts for every single tool.
*   **Memory is Siloed**: Mem0 and Letta are powerful, but require specific integrations. An agent in Cursor doesn't know what you told your Email Agent yesterday.
*   **Guardrails are Primitive**: Tools focus on *content safety* (toxicity), not *action permissions* ("Can I spend $50?").

### The Solution: Memvex
Memvex (formerly Cortex) is the **Personal Runtime**. It is an open-source MCP server that gives every agent you use access to:
1.  **Identity**: "Who am I?" (Preferences, style, context - defined once in `memvex.yaml`).
2.  **Memory**: "What do I know?" (Shared knowledge across all agents).
3.  **Guard**: "What can I do?" (Action-level permissions and approvals).

## Market Analysis

| Pillar | State of the Art | The Memvex Gap |
| :--- | :--- | :--- |
| **Identity** | `AGENTS.md`, `mikhashev/pct-mcp-server` | **The "Personal" Wedge**. No universal config standard exists. Memvex establishes `~/.memvex/config.yaml`. |
| **Memory** | **Mem0** ($24M), Letta, Zep | **Integration**. Memvex abstracts these into a unified interface. We don't rebuild memory; we route it. |
| **Guardrails** | **Cerbos**, HumanLayer, Guardrails AI | **Action Control**. We provide the "User Policy Engine" for agent actions (spending, file access), not just text safety. |

## Core Differentiation

1.  **The "Personal" Focus**: Unlike Enterprise/Team platforms (Microsoft, CrewAI), Memvex is for the **individual power user**.
2.  **The Config Standard**: We aim to make `memvex.yaml` the `gitconfig` of the AI age.
3.  **Multi-Agent Conflict Detection**: The "killer feature" is detecting when Agent A's actions contradict Agent B's goals (e.g., scheduling conflicts).
4.  **MCP-Native**: We don't build a new ecosystem. We ride the MCP wave to be compatible with Claude, Cursor, and everything else on Day 1.

## Architecture

Memvex is a monorepo offering a unified MCP server:
*   `@memvex/identity`: The profile manager.
*   `@memvex/memory`: The context router (pluggable backends).
*   `@memvex/guard`: The policy engine.

*Based on internal strategic analysis - Feb 2026*

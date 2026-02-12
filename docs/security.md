# Security

## Security Model

Memvex follows a **local-first** security model:

- **All data is local**: Identity, memory, and guard rules are stored on your machine in `memvex.yaml` and a local SQLite database. Nothing is sent to any cloud service.
- **Stdio transport**: The MCP server communicates over stdio, meaning there is no network port exposed by default.
- **No telemetry**: Memvex does not collect analytics, usage data, or error reports.
- **Human-readable config**: All configuration is in YAML, designed to be auditable and `git diff`-able.

## Threat Model

### What Memvex protects against
- **Agent overreach**: Guard rules prevent agents from taking unauthorized actions (spending money, sending emails, modifying production).
- **Cross-agent conflicts**: Future conflict detection will alert when agents take contradictory actions.

### What Memvex does NOT protect against
- **Compromised LLM providers**: If your LLM provider is compromised, Memvex cannot verify the intent of tool calls.
- **Local system compromise**: If your machine is compromised, all local data is accessible.

## Reporting Vulnerabilities

See [SECURITY.md](../SECURITY.md) in the project root for the vulnerability reporting process.

# Security Policy

## Supported Versions

| Version | Supported |
| :--- | :--- |
| 0.x (current) | ✅ |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please email **zerothagent@gmail.com** with:

1. A description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a timeline for a fix.

## Security Model

Memvex is a **local-first** application:

- All data (identity, memory, guard rules) is stored on the user's machine
- The MCP server runs locally over stdio — no network exposure by default
- No telemetry or analytics are collected
- Configuration files (`memvex.yaml`) are human-readable and version-controllable

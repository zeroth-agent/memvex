# Cursor Integration

## Setup

1. Open Cursor and go to **Settings** → **Features** → **MCP**

2. Click **"Add new MCP server"** and configure:

   - **Name**: `memvex`
   - **Type**: `command`
   - **Command**: `npx -y memvex serve`

   Or add directly to your Cursor MCP config file (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "memvex": {
      "command": "npx",
      "args": ["-y", "memvex", "serve"]
    }
  }
}
```

3. Restart Cursor.

## Usage

Cursor's AI assistant will now have access to your identity, memory, and guard tools. Try:

> "Check my coding preferences before writing this function"

Cursor will call `identity_get("coding")` to retrieve your style, language, and conventions.

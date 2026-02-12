# Claude Desktop Integration

## Setup

1. Open your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the Memvex MCP server:

```json
{
  "mcpServers": {
    "memvex": {
      "command": "npx",
      "args": ["-y", "memvex", "serve"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

3. Restart Claude Desktop.

## Usage

Once connected, Claude will have access to these tools:

- **`identity_get`** — Query your preferences (e.g. "What's my coding style?")
- **`memory_store`** / **`memory_recall`** — Store and recall cross-agent memories
- **`guard_check`** — Check if an action is permitted

## Example

Ask Claude:
> "What's my preferred coding style?"

Claude will call `identity_get("coding.style")` and respond with your configured preference.

# API Reference — MCP Tools

These tools are exposed by the Memvex MCP server and can be called by any connected agent.

## Identity Tools

### `identity_get`

Get user identity or preference by dot-notation path.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `path` | string | No | Dot-notation path (e.g. `coding.style`). Returns full config if omitted. |

**Example:**
```json
{ "path": "communication.team" }
→ "casual, direct"
```

## Memory Tools

### `memory_store`

Store a new memory. Available to all agents.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `content` | string | Yes | The memory content |
| `namespace` | string | No | Namespace for grouping (e.g. `work`, `personal`) |
| `tags` | string[] | No | Tags for filtering |

### `memory_recall`

Recall memories matching a query.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `query` | string | Yes | Natural language search query |
| `namespace` | string | No | Filter by namespace |
| `limit` | number | No | Max results (default: 10) |

### `memory_forget`

Delete a specific memory.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `id` | string | Yes | Memory ID to delete |

## Guard Tools

### `guard_check`

Check if an action is allowed by the user's guard rules.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `action` | string | Yes | Action name (e.g. `spend_money`) |
| `params` | object | No | Action parameters (e.g. `{ amount: 75 }`) |

**Response:**
```json
{
  "allowed": false,
  "reason": "Amount $75 exceeds auto-approval limit of $50",
  "requiresApproval": true,
  "approvalId": "uuid-here"
}
```

### `guard_request_approval`

Request human approval for a blocked action.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `action` | string | Yes | The action requiring approval |
| `reason` | string | No | Why the agent wants to do this |

### `guard_list_pending`

List all actions currently pending human approval. No parameters required.

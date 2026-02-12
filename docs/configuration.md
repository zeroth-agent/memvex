# Configuration Reference

Memvex is configured via a `memvex.yaml` file. Run `memvex init` to generate one interactively.

## Full Schema

```yaml
identity:
  name: "Your Name"
  role: "Your role or context"
  communication:
    team: casual, direct       # How agents talk to teammates
    external: professional     # How agents talk to external contacts
  coding:
    language: typescript       # Primary language
    style: functional          # functional | oop | imperative
    testing: vitest            # Preferred test framework
  scheduling:
    no_meetings_before: "10:00"
    focus_blocks: ["Tue 9-12", "Thu 9-12"]

memory:
  enabled: true
  storage: sqlite              # sqlite | memory

guard:
  enabled: true
  rules:
    - action: "spend_money"
      max: 50
      require_approval_above: 50
    - action: "send_external_email"
      require_approval: true
    - action: "modify_production"
      blocked: true
      message: "Use staging first"
```

## Sections

### `identity`

| Field | Type | Description |
|:---|:---|:---|
| `name` | string | Your name |
| `role` | string | Your role or context |
| `communication` | object | Communication style preferences |
| `coding` | object | Coding preferences (language, style, testing) |
| `scheduling` | object | Scheduling preferences |

The identity section supports arbitrary nested keys. Agents query these via `identity_get("coding.style")`.

### `memory`

| Field | Type | Default | Description |
|:---|:---|:---|:---|
| `enabled` | boolean | `true` | Enable cross-agent memory |
| `storage` | string | `sqlite` | Storage backend (`sqlite` or `memory`) |

### `guard`

| Field | Type | Description |
|:---|:---|:---|
| `enabled` | boolean | Enable guard rules |
| `rules` | array | List of guard rules |

### Guard Rule Fields

| Field | Type | Description |
|:---|:---|:---|
| `action` | string | Action name (e.g. `spend_money`) |
| `max` | number | Maximum allowed amount |
| `require_approval` | boolean | Always require human approval |
| `require_approval_above` | number | Require approval above this threshold |
| `blocked` | boolean | Completely block this action |
| `message` | string | Message shown when blocked/pending |

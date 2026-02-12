/**
 * MCP Tool definitions for the Guard module.
 * These are registered on the MCP server so any agent can check permissions.
 */
export const GUARD_TOOLS = [
    {
        name: "guard_check",
        description: "Check if an action is allowed by the user's guard rules. Returns whether the action is permitted, blocked, or requires human approval.",
        inputSchema: {
            type: "object",
            properties: {
                action: { type: "string", description: "The action to check (e.g. 'spend_money', 'send_external_email')" },
                params: {
                    type: "object",
                    description: "Optional parameters for the action (e.g. { amount: 75 })",
                    additionalProperties: true,
                },
            },
            required: ["action"],
        },
    },
    {
        name: "guard_request_approval",
        description: "Request human approval for a blocked action. Returns an approval ID that can be checked later.",
        inputSchema: {
            type: "object",
            properties: {
                action: { type: "string", description: "The action requiring approval" },
                reason: { type: "string", description: "Why the agent wants to perform this action" },
            },
            required: ["action"],
        },
    },
    {
        name: "guard_list_pending",
        description: "List all actions currently pending human approval.",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
];

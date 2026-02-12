/**
 * MCP Tool definitions for the Memory module.
 * These are registered on the MCP server so any agent can store/recall/forget memories.
 */
export const MEMORY_TOOLS = [
    {
        name: "memory_store",
        description: "Store a new memory. Agents use this to save learnings, context, or facts that should persist across conversations and be available to all agents.",
        inputSchema: {
            type: "object",
            properties: {
                content: { type: "string", description: "The memory content to store" },
                namespace: { type: "string", description: "Optional namespace (e.g. 'work', 'personal', 'project:atlas')" },
                tags: { type: "array", items: { type: "string" }, description: "Optional tags for filtering" },
            },
            required: ["content"],
        },
    },
    {
        name: "memory_recall",
        description: "Recall memories matching a natural-language query. Returns relevant stored memories across all agents.",
        inputSchema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Natural language search query" },
                namespace: { type: "string", description: "Optional namespace to filter by" },
                limit: { type: "number", description: "Max results (default: 10)" },
            },
            required: ["query"],
        },
    },
    {
        name: "memory_forget",
        description: "Delete a specific memory by its ID.",
        inputSchema: {
            type: "object",
            properties: {
                id: { type: "string", description: "Memory ID to delete" },
            },
            required: ["id"],
        },
    },
];

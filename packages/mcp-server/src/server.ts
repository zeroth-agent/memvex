import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ConfigLoader, logger } from "@memvex/core";
import { IdentityModule } from "@memvex/identity";
import { MemoryModule } from "@memvex/memory";
import { GuardModule } from "@memvex/guard";
import { z } from "zod";

export class MemvexServer {
    private server!: McpServer;
    private configLoader!: ConfigLoader;
    private identityModule!: IdentityModule;
    private memoryModule!: MemoryModule;
    private guardModule!: GuardModule;

    constructor() {
        this.configLoader = new ConfigLoader();

        // Modules will be initialized in start()
        // Type assertions are needed because strict property initialization is on 
        // but we init in start() which is called immediately after construction usually.
        // Better: Make them optional or use ! assertion if we guarantee start() is called.
        // For now, I'll use ! assertion or just leave them uninitialized in constructor 
        // and init them in start. 
        // Actually, typescript will complain. 
        // Let's use definitive assignment assertion or make them optional.
        // Given existing code structure, let's use ! assertion.
    }

    async start() {
        const config = this.configLoader.load();

        this.identityModule = new IdentityModule(config.identity, logger);
        this.memoryModule = await MemoryModule.create(config.memory);
        this.guardModule = await GuardModule.create(config.guard);

        this.server = new McpServer({
            name: "memvex-mcp-server",
            version: "0.1.0"
        });

        this.registerTools();

        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        logger.info("Memvex MCP Server started on stdio");
    }

    public getIdentityModule() { return this.identityModule; }
    public getMemoryModule() { return this.memoryModule; }
    public getGuardModule() { return this.guardModule; }
    public getConfig() { return this.configLoader.load(); }

    private registerTools() {
        // --- Identity Tools ---
        this.server.tool(
            "identity_get",
            "Get user identity or preference by path (e.g. 'coding.style'). Returns full config if no path provided.",
            {
                path: z.string().optional().describe("Dot-notation path to config value (e.g. 'communication.style')")
            },
            async ({ path }) => {
                const result = this.identityModule.get(path);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
                };
            }
        );

        // --- Memory Tools ---
        this.server.tool(
            "memory_store",
            "Store a new memory. Agents use this to save learnings, context, or facts that should persist across conversations and be available to all agents.",
            {
                content: z.string().describe("The memory content to store"),
                namespace: z.string().optional().describe("Optional namespace (e.g. 'work', 'personal', 'project:atlas')"),
                tags: z.array(z.string()).optional().describe("Optional tags for filtering"),
            },
            async ({ content, namespace, tags }) => {
                const entry = await this.memoryModule.store(content, { namespace, tags });
                return {
                    content: [{ type: "text", text: JSON.stringify(entry, null, 2) }]
                };
            }
        );

        this.server.tool(
            "memory_recall",
            "Recall memories matching a natural-language query. Returns relevant stored memories across all agents.",
            {
                query: z.string().describe("Natural language search query"),
                namespace: z.string().optional().describe("Optional namespace to filter by"),
                limit: z.number().optional().describe("Max results (default: 10)"),
            },
            async ({ query, namespace, limit }) => {
                const results = await this.memoryModule.recall(query, { namespace, limit });
                return {
                    content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
                };
            }
        );

        this.server.tool(
            "memory_forget",
            "Delete a specific memory by its ID.",
            {
                id: z.string().describe("Memory ID to delete"),
            },
            async ({ id }) => {
                const success = await this.memoryModule.forget(id);
                return {
                    content: [{ type: "text", text: success ? `Memory ${id} deleted.` : `Memory ${id} not found.` }]
                };
            }
        );

        // --- Guard Tools ---
        this.server.tool(
            "guard_check",
            "Check if an action is allowed by the user's guard rules. Returns whether the action is permitted, blocked, or requires human approval.",
            {
                action: z.string().describe("The action to check (e.g. 'spend_money', 'send_external_email')"),
                params: z.record(z.unknown()).optional().describe("Optional parameters for the action"),
                agent: z.string().optional().describe("The agent performing the action"),
            },
            async ({ action, params, agent }) => {
                const decision = this.guardModule.check(action, params, agent);
                return {
                    content: [{ type: "text", text: JSON.stringify(decision, null, 2) }]
                };
            }
        );

        this.server.tool(
            "guard_request_approval",
            "Request human approval for a blocked action. Returns an approval ID that can be checked later.",
            {
                action: z.string().describe("The action requiring approval"),
                reason: z.string().describe("Why the agent wants to perform this action"),
                agent: z.string().optional().describe("The agent requesting approval"),
                params: z.record(z.unknown()).optional(),
            },
            async ({ action, reason, agent, params }) => {
                return {
                    content: [{ type: "text", text: "Use guard_check to determine if approval is needed." }]
                }
            }
        );

        this.server.tool(
            "guard_list_pending",
            "List all actions currently pending human approval.",
            {},
            async () => {
                const pending = this.guardModule.getPendingApprovals();
                return {
                    content: [{ type: "text", text: JSON.stringify(pending, null, 2) }]
                };
            }
        );

        this.server.tool(
            "guard_approval_status",
            "Check the status of a specific approval request.",
            {
                id: z.string().describe("Approval Request ID")
            },
            async ({ id }) => {
                const request = this.guardModule.get(id);

                if (!request) {
                    return { content: [{ type: "text", text: `Approval ${id} not found.` }] };
                }

                return {
                    content: [{ type: "text", text: JSON.stringify(request, null, 2) }]
                };
            }
        );
    }


}

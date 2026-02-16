import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ConfigLoader, logger } from "@memvex/core";
import { IdentityModule } from "@memvex/identity";
import { MemoryModule } from "@memvex/memory";
import { z } from "zod";

export class MemvexServer {
    private server: McpServer;
    private configLoader: ConfigLoader;
    private identityModule: IdentityModule;
    private memoryModule: MemoryModule;

    constructor() {
        this.configLoader = new ConfigLoader();
        const config = this.configLoader.load();

        this.identityModule = new IdentityModule(config.identity, logger);
        this.memoryModule = MemoryModule.create(config.memory);

        this.server = new McpServer({
            name: "memvex-mcp-server",
            version: "0.1.0"
        });

        this.registerTools();
    }

    private registerTools() {
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
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        logger.info("Memvex MCP Server started on stdio");
    }
}

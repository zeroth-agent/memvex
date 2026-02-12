import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ConfigLoader, logger } from "@cortex/core";
import { IdentityModule, IDENTITY_TOOLS } from "@cortex/identity";
import { z } from "zod";

export class CortexServer {
    private server: McpServer;
    private configLoader: ConfigLoader;
    private identityModule: IdentityModule;

    constructor() {
        this.configLoader = new ConfigLoader();
        const config = this.configLoader.load();

        this.identityModule = new IdentityModule(config.identity, logger);

        this.server = new McpServer({
            name: "memvex-mcp-server",
            version: "0.1.0"
        });

        this.registerTools();
    }

    private registerTools() {
        // Identity Tools
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
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        logger.info("Memvex MCP Server started on stdio");
    }
}

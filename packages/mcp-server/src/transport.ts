import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export type TransportType = "stdio" | "sse";

export class TransportManager {
    static createStdioTransport() {
        return new StdioServerTransport();
    }

    static createSSETransport(path: string, res: any) {
        // Placeholder for SSE implementation details
        return new SSEServerTransport(path, res);
    }
}

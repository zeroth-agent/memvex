#!/usr/bin/env node

/**
 * MCP Server Entry Point
 * This file starts the Memvex MCP server when run directly
 */

import { MemvexServer } from './server.js';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

async function main() {
    const server = new MemvexServer();
    await server.start();

    // Check for --dashboard flag
    if (process.argv.includes('--dashboard')) {
        try {
            process.stderr.write(`[INFO] Starting dashboard in SHARED PROCESS mode...\n`);

            // ...

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            // Import source file directly - tsx can handle .ts files
            // On Windows, import() requires file:// URL
            const dashboardPath = path.resolve(__dirname, '../../dashboard/server/api.ts');
            const dashboardUrl = pathToFileURL(dashboardPath).href;

            const { createDashboardServer } = await import(dashboardUrl);

            const { app, port } = await createDashboardServer({
                memory: server.getMemoryModule(),
                guard: server.getGuardModule(),
                identity: server.getIdentityModule(),
                config: server.getConfig()
            });

            // Start listening with error handling
            const httpServer = app.listen(port, () => {
                process.stderr.write(`[Dashboard] Running at http://localhost:${port} (Shared Memory)\n`);
            });

            httpServer.on('error', (e: any) => {
                if (e.code === 'EADDRINUSE') {
                    process.stderr.write(`[ERROR] Dashboard port ${port} is already in use. Dashboard will not be available.\n`);
                } else {
                    process.stderr.write(`[ERROR] Dashboard server error: ${e}\n`);
                }
            });

        } catch (err) {
            process.stderr.write(`[ERROR] Failed to start in-process dashboard: ${err}\n`);
        }
    }
}

main().catch((error) => {
    process.stderr.write(`Failed to start Memvex MCP server: ${error}\n`);
    process.exit(1);
});

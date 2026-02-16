#!/usr/bin/env node

/**
 * MCP Server Entry Point
 * This file starts the Memvex MCP server when run directly
 */

import { MemvexServer } from './server.js';
import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
    const server = new MemvexServer();
    await server.start();

    // Check for --dashboard flag
    if (process.argv.includes('--dashboard')) {
        try {
            process.stderr.write(`[INFO] Starting dashboard in SHARED PROCESS mode...\n`);

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const dashboardPath = path.resolve(__dirname, '../../dashboard/server/api.ts');

            // Dynamic import of the dashboard factory
            const { createDashboardServer } = await import(dashboardPath);

            const { app, port } = await createDashboardServer({
                memory: server.getMemoryModule(),
                guard: server.getGuardModule(),
                identity: server.getIdentityModule(),
                config: server.getConfig()
            });

            // Start listening
            app.listen(port, () => {
                process.stderr.write(`[Dashboard] Running at http://localhost:${port} (Shared Memory)\n`);
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

#!/usr/bin/env node

/**
 * MCP Server Entry Point
 * This file starts the Memvex MCP server when run directly
 */

import { MemvexServer } from './server.js';
import { spawn } from 'child_process';
import path from 'path';

async function main() {
    // Check for --dashboard flag
    if (process.argv.includes('--dashboard')) {
        try {
            // Resolve path to dashboard server script relative to this file
            // ../../dashboard/server/api.ts
            const dashboardScript = path.resolve(__dirname, '../../dashboard/server/api.ts');

            // Log to stderr because stdout is for MCP protocol
            process.stderr.write(`[INFO] Starting dashboard from ${dashboardScript}...\n`);

            const dashboard = spawn('npx', ['tsx', dashboardScript], {
                stdio: 'inherit', // inherit means it shares stderr/stdout, but we must be careful with stdout pollution
                // Actually, dashboard logs to stdout might break MCP if they are not careful.
                // But Express logs usually go to stdout.
                // SAFEST: Ignore stdout, pipe stderr.
                // OR: Pipe stdout to stderr? 
                // Let's use 'pipe' and handle it.
                shell: true,
                env: { ...process.env }
            });

            // Redirect dashboard stdout to stderr to protect MCP protocol
            if (dashboard.stdout) {
                dashboard.stdout.on('data', (data) => {
                    process.stderr.write(`[Dashboard] ${data}`);
                });
            }
            if (dashboard.stderr) {
                dashboard.stderr.on('data', (data) => {
                    process.stderr.write(`[Dashboard Error] ${data}`);
                });
            }

            dashboard.on('error', (err) => {
                process.stderr.write(`[ERROR] Failed to start dashboard: ${err}\n`);
            });
        } catch (err) {
            process.stderr.write(`[ERROR] Error spawning dashboard: ${err}\n`);
        }
    }

    const server = new MemvexServer();
    await server.start();
    // Server stays running on stdio transport
}

main().catch((error) => {
    process.stderr.write(`Failed to start Memvex MCP server: ${error}\n`);
    process.exit(1);
});

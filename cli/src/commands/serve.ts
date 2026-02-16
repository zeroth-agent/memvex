import { Command } from 'commander';
import { MemvexServer } from '@memvex/mcp-server';
import { logger } from '@memvex/core';

import { spawn } from 'child_process';
import path from 'path';

export const serveCommand = new Command('serve')
    .description('Start the Memvex MCP server')
    .option('--dashboard', 'Start the operational dashboard')
    .action(async (opts) => {
        try {
            if (opts.dashboard) {
                // Resolve path to dashboard server script
                // Assuming we are running from packages/cli/dist or src
                // Monorepo structure: root/packages/cli vs root/packages/dashboard
                const dashboardScript = path.resolve(__dirname, '../../../packages/dashboard/server/api.ts');

                logger.info('Starting dashboard...', { script: dashboardScript });

                const dashboard = spawn('npx', ['tsx', dashboardScript], {
                    stdio: 'inherit',
                    shell: true,
                    env: { ...process.env }
                });

                dashboard.on('error', (err) => {
                    logger.error('Failed to start dashboard:', err);
                });
            }

            const server = new MemvexServer();
            await server.start();
        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    });

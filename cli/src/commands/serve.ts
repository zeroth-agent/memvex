import { Command } from 'commander';
import { CortexServer } from '@cortex/mcp-server';
import { logger } from '@cortex/core';

export const serveCommand = new Command('serve')
    .description('Start the Memvex MCP server')
    .action(async () => {
        try {
            const server = new CortexServer();
            await server.start();
        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    });

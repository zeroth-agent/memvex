import { Command } from 'commander';
import { MemvexServer } from '@memvex/mcp-server';
import { logger } from '@memvex/core';

export const serveCommand = new Command('serve')
    .description('Start the Memvex MCP server')
    .action(async () => {
        try {
            const server = new MemvexServer();
            await server.start();
        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    });

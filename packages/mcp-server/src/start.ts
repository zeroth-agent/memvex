#!/usr/bin/env node

/**
 * MCP Server Entry Point
 * This file starts the Memvex MCP server when run directly
 */

import { MemvexServer } from './server.js';

async function main() {
    const server = new MemvexServer();
    await server.start();
    // Server stays running on stdio transport
}

main().catch((error) => {
    console.error('Failed to start Memvex MCP server:', error);
    process.exit(1);
});

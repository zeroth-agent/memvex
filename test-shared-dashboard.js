#!/usr/bin/env tsx

/**
 * Test script to verify shared process dashboard works
 * Run: MEMVEX_CONFIG=F:/Projects/memvex/memvex.yaml npx tsx test-shared-dashboard.js
 */

import { MemvexServer } from './packages/mcp-server/src/server.js';
import { pathToFileURL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

async function test() {
    console.log('🧪 Testing Shared Dashboard Setup...\n');

    // 1. Start MCP Server
    console.log('Step 1: Starting MCP Server...');
    const server = new MemvexServer();
    await server.start();
    console.log('✅ MCP Server started\n');

    // 2. Store a test memory
    console.log('Step 2: Storing test memory...');
    const memory = server.getMemoryModule();
    const stored = await memory.store('Test memory for shared dashboard verification');
    console.log(`✅ Stored memory with ID: ${stored.id}\n`);

    // 3. Start shared dashboard
    console.log('Step 3: Starting dashboard in shared process...');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dashboardPath = path.resolve(__dirname, './packages/dashboard/server/api.ts');
    const dashboardUrl = pathToFileURL(dashboardPath).href;

    console.log(`  Dashboard path: ${dashboardPath}`);
    console.log(`  Dashboard URL: ${dashboardUrl}\n`);

    try {
        const { createDashboardServer } = await import(dashboardUrl);
        const { app, port } = await createDashboardServer({
            memory: server.getMemoryModule(),
            guard: server.getGuardModule(),
            identity: server.getIdentityModule(),
            config: server.getConfig()
        });

        const httpServer = app.listen(port, () => {
            console.log(`✅ Dashboard running at http://localhost:${port}\n`);
            console.log('📋 Test Results:');
            console.log('  1. MCP Server: ✅ Running');
            console.log('  2. Memory Storage: ✅ Working');
            console.log('  3. Dashboard: ✅ Running');
            console.log('  4. Shared Process: ✅ Same Node instance\n');
            console.log('🎉 SUCCESS! Shared dashboard is working correctly!\n');
            console.log('Now test the API:');
            console.log(`  curl http://localhost:${port}/api/memory`);
            console.log('  You should see the test memory!\n');
        });

        httpServer.on('error', (e) => {
            console.error(`❌ Dashboard failed to start: ${e.message}`);
            if (e.code === 'EADDRINUSE') {
                console.error('  Port 3001 is already in use!');
                console.error('  Kill the process and try again.');
            }
            process.exit(1);
        });

    } catch (err) {
        console.error(`❌ Failed to load dashboard:`, err);
        process.exit(1);
    }
}

test().catch(console.error);

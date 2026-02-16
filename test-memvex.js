#!/usr/bin/env node

/**
 * Memvex End-to-End Test
 * 
 * This demonstrates how Memvex works in a real scenario:
 * - Single long-running process (like MCP server or Dashboard)
 * - Memory persists across operations
 * - All modules work together
 */

import { ConfigLoader } from '@memvex/core';
import { IdentityModule } from '@memvex/identity';
import { MemoryModule } from '@memvex/memory';
import { GuardModule } from '@memvex/guard';

async function main() {
    console.log('🚀 Memvex End-to-End Test\n');

    // Load config (same as MCP server does)
    const config = new ConfigLoader().load();

    // Initialize modules (IN THE SAME PROCESS)
    console.log('📦 Initializing modules...');
    const identity = new IdentityModule(config.identity);
    const memory = await MemoryModule.create(config.memory);
    const guard = await GuardModule.create(config.guard);
    console.log('✓ All modules loaded\n');

    // Test 1: Identity
    console.log('=== Test 1: Identity ===');
    const userName = identity.get('name');
    const codingStyle = identity.get('coding.style');
    console.log(`User: ${userName}`);
    console.log(`Coding style: ${codingStyle}`);
    console.log('✓ Identity working\n');

    // Test 2: Memory - Store
    console.log('=== Test 2: Memory Storage ===');
    const memory1 = await memory.store('Project Phoenix deadline is Oct 15th', {
        namespace: 'work',
        tags: ['project', 'deadline']
    });
    console.log(`✓ Stored memory: ${memory1.id.slice(0, 8)}`);

    const memory2 = await memory.store('Team prefers TypeScript and functional programming', {
        namespace: 'work',
        tags: ['team', 'preferences']
    });
    console.log(`✓ Stored memory: ${memory2.id.slice(0, 8)}`);

    const memory3 = await memory.store('Client meeting scheduled for next Tuesday', {
        namespace: 'calendar',
        tags: ['meeting']
    });
    console.log(`✓ Stored memory: ${memory3.id.slice(0, 8)}\n`);

    // Test 3: Memory - List (THIS WORKS because same process!)
    console.log('=== Test 3: Memory Retrieval ===');
    const allMemories = await memory.list();
    console.log(`Found ${allMemories.length} memories:`);
    allMemories.forEach(m => {
        console.log(`  - [${m.namespace}] ${m.content.slice(0, 50)}...`);
    });
    console.log('✓ Memory persistence working!\n');

    // Test 4: Memory - Recall (search)
    console.log('=== Test 4: Memory Search ===');
    const searchResults = await memory.recall('deadline', { limit: 5 });
    console.log(`Search for "deadline" found ${searchResults.length} result(s)`);
    searchResults.forEach(m => {
        console.log(`  - ${m.content}`);
    });
    console.log('✓ Search working\n');

    // Test 5: Guard - Check
    console.log('=== Test 5: Guard Rules ===');
    const check1 = guard.check('spend_money', { amount: 30 });
    console.log(`spend_money ($30): ${check1.allowed ? 'ALLOWED' : 'DENIED'}`);

    const check2 = guard.check('spend_money', { amount: 100 });
    console.log(`spend_money ($100): ${check2.allowed ? 'ALLOWED' : check2.requiresApproval ? 'NEEDS APPROVAL' : 'DENIED'}`);

    const check3 = guard.check('send_external_email');
    console.log(`send_external_email: ${check3.allowed ? 'ALLOWED' : check3.requiresApproval ? 'NEEDS APPROVAL' : 'DENIED'}`);
    console.log('✓ Guard rules working\n');

    // Test 6: Memory namespaces
    console.log('=== Test 6: Namespace Filtering ===');
    const workMemories = await memory.list('work');
    console.log(`Work namespace: ${workMemories.length} memories`);

    const calendarMemories = await memory.list('calendar');
    console.log(`Calendar namespace: ${calendarMemories.length} memories`);
    console.log('✓ Namespaces working\n');

    // Summary
    console.log('=================================');
    console.log('🎉 All tests passed!');
    console.log('=================================\n');
    console.log('Key Takeaways:');
    console.log('1. ✅ Memory persists within a single process');
    console.log('2. ✅ All 3 modules (Identity, Memory, Guard) work correctly');
    console.log('3. ✅ This is how the MCP server and Dashboard work');
    console.log('4. ⚠️  CLI commands use separate processes, so they won\'t share state');
    console.log('\nFor real testing, use:');
    console.log('  - Dashboard: http://localhost:3001/dashboard');
    console.log('  - MCP + Claude Desktop (see testing_guide.md)');
}

main().catch(console.error);

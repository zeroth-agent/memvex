import { Command } from 'commander';
import { MemoryModule } from '@memvex/memory';
import { ConfigLoader, logger } from '@memvex/core';

export const memoryCommand = new Command('memory')
    .description('Interact with the memory module');

memoryCommand
    .command('add <content>')
    .description('Store a new memory')
    .option('-n, --namespace <namespace>', 'Namespace for the memory')
    .option('-t, --tags <tags>', 'Comma-separated tags')
    .action(async (content, opts) => {
        try {
            const config = new ConfigLoader().load();
            const memory = await MemoryModule.create(config.memory);
            const tags = opts.tags ? opts.tags.split(',').map((t: string) => t.trim()) : undefined;

            const entry = await memory.store(content, {
                namespace: opts.namespace,
                tags
            });

            console.log(`✓ Memory stored with ID: ${entry.id}`);
            if (entry.namespace) console.log(`  Namespace: ${entry.namespace}`);
            if (entry.tags?.length) console.log(`  Tags: ${entry.tags.join(', ')}`);
        } catch (err: any) {
            logger.error('Failed to store memory:', err.message);
        }
    });

memoryCommand
    .command('list')
    .description('List recent memories')
    .option('-n, --namespace <namespace>', 'Filter by namespace')
    .action(async (opts) => {
        try {
            const config = new ConfigLoader().load();
            const memory = await MemoryModule.create(config.memory);
            const entries = await memory.list(opts.namespace);

            if (entries.length === 0) {
                console.log('No memories stored yet.');
                return;
            }

            for (const entry of entries) {
                const ns = entry.namespace ? ` [${entry.namespace}]` : '';
                const tags = entry.tags?.length ? ` (${entry.tags.join(', ')})` : '';
                console.log(`${entry.id.slice(0, 8)}  ${entry.createdAt}${ns}${tags}`);
                console.log(`  ${entry.content}`);
                console.log();
            }
        } catch (err: any) {
            logger.error('Failed to list memories:', err.message);
        }
    });

memoryCommand
    .command('recall <query>')
    .description('Search memories by query')
    .option('-n, --namespace <namespace>', 'Filter by namespace')
    .option('-l, --limit <limit>', 'Max results', '10')
    .action(async (query, opts) => {
        try {
            const config = new ConfigLoader().load();
            const memory = await MemoryModule.create(config.memory);
            const results = await memory.recall(query, {
                namespace: opts.namespace,
                limit: parseInt(opts.limit),
            });

            if (results.length === 0) {
                console.log(`No memories found for "${query}".`);
                return;
            }

            console.log(`Found ${results.length} memor${results.length === 1 ? 'y' : 'ies'}:\n`);
            for (const entry of results) {
                const ns = entry.namespace ? ` [${entry.namespace}]` : '';
                console.log(`${entry.id.slice(0, 8)}  ${entry.createdAt}${ns}`);
                console.log(`  ${entry.content}`);
                console.log();
            }
        } catch (err: any) {
            logger.error('Failed to recall memories:', err.message);
        }
    });

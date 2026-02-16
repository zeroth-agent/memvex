import { Command } from 'commander';
import { MemoryModule } from '@memvex/memory';
import { ConfigLoader, logger } from '@memvex/core';

export const memoryCommand = new Command('memory')
    .description('Interact with the memory module');

memoryCommand
    .command('list')
    .description('List recent memories')
    .option('-n, --namespace <namespace>', 'Filter by namespace')
    .action(async (opts) => {
        try {
            const config = new ConfigLoader().load();
            const memory = MemoryModule.create(config.memory);
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
            const memory = MemoryModule.create(config.memory);
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

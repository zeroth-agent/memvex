import { Command } from 'commander';

export const memoryCommand = new Command('memory')
    .description('Interact with memory module')
    .action(() => {
        console.log('Memory: Not implemented');
    });

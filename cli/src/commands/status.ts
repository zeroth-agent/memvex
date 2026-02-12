import { Command } from 'commander';

export const statusCommand = new Command('status')
    .description('Show status of Memvex components')
    .action(() => {
        console.log('Status: Not implemented');
    });

import { Command } from 'commander';

export const guardCommand = new Command('guard')
    .description('Manage guard rules and approvals')
    .action(() => {
        console.log('Guard: Not implemented');
    });

import { Command } from 'commander';
import { GuardModule } from '@memvex/guard';
import { ConfigLoader, logger } from '@memvex/core';

export const guardCommand = new Command('guard')
    .description('Manage guard rules and approvals');

guardCommand
    .command('check <action>')
    .description('Check if an action is allowed')
    .option('-p, --params <json>', 'JSON parameters for the action')
    .action(async (action, opts) => {
        try {
            const config = new ConfigLoader().load();
            const guard = GuardModule.create(config.guard);

            let params = {};
            if (opts.params) {
                params = JSON.parse(opts.params);
            }

            const decision = guard.check(action, params);
            console.log(JSON.stringify(decision, null, 2));
        } catch (err: any) {
            logger.error('Failed to check action:', err.message);
        }
    });

guardCommand
    .command('pending')
    .description('List pending approval requests')
    .action(async () => {
        try {
            const config = new ConfigLoader().load();
            const guard = GuardModule.create(config.guard);
            const pending = guard.getPendingApprovals();

            if (pending.length === 0) {
                console.log('No pending approvals.');
                return;
            }

            console.log(`Found ${pending.length} pending request${pending.length === 1 ? '' : 's'}:\n`);
            for (const req of pending) {
                console.log(`ID: ${req.id}`);
                console.log(`Action: ${req.action}`);
                if (req.agent) console.log(`Agent: ${req.agent}`);
                if (req.params && Object.keys(req.params).length > 0) {
                    console.log(`Params: ${JSON.stringify(req.params)}`);
                }
                console.log(`Created: ${req.createdAt}`);
                console.log('---');
            }
        } catch (err: any) {
            logger.error('Failed to list pending approvals:', err.message);
        }
    });

guardCommand
    .command('approve <id>')
    .description('Approve a pending request')
    .action(async (id) => {
        try {
            const config = new ConfigLoader().load();
            const guard = GuardModule.create(config.guard);
            const result = guard.approve(id);

            if (result) {
                console.log(`Approved request ${id}.`);
            } else {
                console.log(`Request ${id} not found or not pending.`);
            }
        } catch (err: any) {
            logger.error('Failed to approve request:', err.message);
        }
    });

guardCommand
    .command('deny <id>')
    .description('Deny a pending request')
    .action(async (id) => {
        try {
            const config = new ConfigLoader().load();
            const guard = GuardModule.create(config.guard);
            const result = guard.deny(id);

            if (result) {
                console.log(`Denied request ${id}.`);
            } else {
                console.log(`Request ${id} not found or not pending.`);
            }
        } catch (err: any) {
            logger.error('Failed to deny request:', err.message);
        }
    });

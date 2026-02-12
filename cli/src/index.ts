#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { serveCommand } from './commands/serve.js';
import { statusCommand } from './commands/status.js';
import { memoryCommand } from './commands/memory.js';
import { guardCommand } from './commands/guard.js';

const program = new Command();

program
    .name('memvex')
    .description('Your personal runtime for AI agents')
    .version('0.1.0');

program.addCommand(initCommand);
program.addCommand(serveCommand);
program.addCommand(statusCommand);
program.addCommand(memoryCommand);
program.addCommand(guardCommand);

program.parse(process.argv);

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { logger } from '@memvex/core';

export const initCommand = new Command('init')
  .description('Initialize a new Memvex configuration')
  .action(async () => {
    const configPath = path.join(process.cwd(), 'memvex.yaml');

    if (fs.existsSync(configPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'memvex.yaml already exists. Overwrite?',
          default: false
        }
      ]);

      if (!overwrite) {
        logger.info('Aborted.');
        return;
      }
    }

    const answers = await inquirer.prompt([
      { type: 'input', name: 'name', message: 'Your Name:' },
      { type: 'input', name: 'role', message: 'Your Role (e.g. "Founder building X"):' },
      { type: 'list', name: 'coding_style', message: 'Preferred coding style:', choices: ['functional', 'oop', 'imperative'] }
    ]);

    const configContent = `identity:
  name: "${answers.name}"
  role: "${answers.role}"
  coding:
    style: ${answers.coding_style}
  communication:
    team: casual
    external: professional

memory:
  enabled: true
  storage: sqlite

guard:
  enabled: true
  rules: []
`;

    fs.writeFileSync(configPath, configContent);
    logger.info(`Initialized memvex.yaml at ${configPath}`);
  });

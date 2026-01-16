#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from '../src/commands/init.js';
import { listCommand } from '../src/commands/list.js';
import { showCommand } from '../src/commands/show.js';
import { addCommand } from '../src/commands/add.js';
import { useCommand } from '../src/commands/use.js';
import { setCommand } from '../src/commands/set.js';
import { deleteCommand } from '../src/commands/delete.js';
import { renameCommand } from '../src/commands/rename.js';
import { exportCommand } from '../src/commands/export.js';
import { importCommand } from '../src/commands/import.js';

const program = new Command();

program
  .name('ccm')
  .description('CLI tool for managing Claude Code configuration profiles')
  .version('1.0.0');

// Init command
program
  .command('init')
  .description('Initialize profile management')
  .action(initCommand);

// List command
program
  .command('list')
  .alias('ls')
  .description('List all profiles')
  .action(listCommand);

// Show command
program
  .command('show')
  .alias('current')
  .description('Show current active profile')
  .action(showCommand);

// Add command
program
  .command('add [name] [url] [key]')
  .description('Add a new profile')
  .option('--no-switch', 'Do not prompt to switch to new profile')
  .action(addCommand);

// Use command
program
  .command('use <name>')
  .description('Switch to a profile')
  .action(useCommand);

// Set command
program
  .command('set [name] [url] [key]')
  .description('Update an existing profile')
  .action(setCommand);

// Delete command
program
  .command('delete <name>')
  .alias('rm')
  .description('Delete a profile')
  .option('-f, --force', 'Skip confirmation prompt')
  .action(deleteCommand);

// Rename command
program
  .command('rename <old-name> <new-name>')
  .alias('mv')
  .description('Rename a profile')
  .action(renameCommand);

// Export command
program
  .command('export [file]')
  .description('Export profiles to a file (default: ./claude-profiles-backup.json)')
  .option('--no-keys', 'Export without API keys')
  .action(exportCommand);

// Import command
program
  .command('import <file>')
  .description('Import profiles from a file')
  .option('--merge', 'Merge with existing profiles (overwrite conflicts)')
  .action(importCommand);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

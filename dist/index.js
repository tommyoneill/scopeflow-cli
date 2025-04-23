#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { runInit } from './commands/init.js';
import { runTest } from './commands/test.js';
const program = new Command();
program
    .name('scopeflow')
    .description('🧠 ScopeFlow: AI-native product strategy scaffolding')
    .version('0.1.0');
program
    .command('init')
    .description('Start a new ScopeFlow project')
    .action(runInit);
program
    .command('test')
    .description('Run ScopeFlow with test inputs')
    .action(runTest);
program.parse();
//# sourceMappingURL=index.js.map
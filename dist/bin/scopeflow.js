#!/usr/bin/env node
import { Command } from 'commander';
import { init } from '../commands/init.js';
import { config } from '../commands/config.js';
import { isCancel } from '@clack/prompts';
// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\n\n👋 Goodbye!');
    process.exit(0);
});
const program = new Command();
program
    .name('scopeflow')
    .description('ScopeFlow CLI - A tool for managing project scope and strategy')
    .version('1.0.0');
program
    .command('init')
    .description('Initialize a new ScopeFlow project')
    .action(async () => {
    try {
        const result = await init();
        if (isCancel(result)) {
            console.log('\n\n👋 Goodbye!');
            process.exit(0);
        }
    }
    catch (error) {
        console.error('\n❌ Error:', error instanceof Error ? error.message : 'An unknown error occurred');
        process.exit(1);
    }
});
program
    .command('config')
    .description('Configure ScopeFlow settings')
    .action(async () => {
    try {
        const result = await config();
        if (isCancel(result)) {
            console.log('\n\n👋 Goodbye!');
            process.exit(0);
        }
    }
    catch (error) {
        console.error('\n❌ Error:', error instanceof Error ? error.message : 'An unknown error occurred');
        process.exit(1);
    }
});
program.parse(process.argv);
//# sourceMappingURL=scopeflow.js.map
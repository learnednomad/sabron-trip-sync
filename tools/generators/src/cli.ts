#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { generateComponent } from './generators/component.js';
import { generateScreen } from './generators/screen.js';
import { generateApiHook } from './generators/api-hook.js';

const program = new Command();

program
  .name('sabron')
  .description('Sabron Travel code generator - Ignite CLI inspired')
  .version('1.0.0');

// Component generator
program
  .command('component')
  .alias('c')
  .description('Generate a new travel component')
  .argument('<name>', 'Component name (e.g., TripForm)')
  .option('-p, --preset <preset>', 'Component preset (travel, default)', 'travel')
  .option('-t, --target <target>', 'Target platform (web, mobile, both)', 'both')
  .option('--with-validation', 'Include form validation')
  .option('--with-state', 'Include state management')
  .option('--with-i18n', 'Include internationalization', true)
  .action(async (name, options) => {
    console.log(chalk.blue(`🎨 Generating component: ${name}`));
    await generateComponent(name, options);
    console.log(chalk.green(`✅ Component ${name} generated successfully!`));
  });

// Screen generator  
program
  .command('screen')
  .alias('s')
  .description('Generate a new travel screen')
  .argument('<name>', 'Screen name (e.g., TripDetails)')
  .option('-t, --target <target>', 'Target platform (web, mobile, both)', 'both')
  .option('--with-header', 'Include header component', true)
  .option('--with-loading', 'Include loading states', true)
  .option('--with-tabs', 'Include tab navigation')
  .option('--type <type>', 'Screen type (single, multi-step)', 'single')
  .action(async (name, options) => {
    console.log(chalk.blue(`📱 Generating screen: ${name}`));
    await generateScreen(name, options);
    console.log(chalk.green(`✅ Screen ${name} generated successfully!`));
  });

// API hook generator
program
  .command('api-hook')
  .alias('api')
  .description('Generate API hook with React Query')
  .argument('<name>', 'Hook name (e.g., useTripBooking)')
  .option('--with-mutation', 'Include mutation hook')
  .option('--with-cache', 'Include cache invalidation', true)
  .action(async (name, options) => {
    console.log(chalk.blue(`🔌 Generating API hook: ${name}`));
    await generateApiHook(name, options);
    console.log(chalk.green(`✅ API hook ${name} generated successfully!`));
  });

// Help command
program
  .command('help')
  .description('Show help information')
  .action(() => {
    console.log(chalk.cyan('🧳 Sabron Travel Generator'));
    console.log('');
    console.log(chalk.yellow('Examples:'));
    console.log('  sabron component TripForm --preset=travel --with-validation');
    console.log('  sabron screen BookingFlow --type=multi-step --with-tabs');
    console.log('  sabron api-hook useTripBooking --with-mutation');
    console.log('');
    program.help();
  });

program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  console.log(chalk.cyan('🧳 Sabron Travel Generator'));
  console.log('');
  program.outputHelp();
}
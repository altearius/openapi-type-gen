#!/usr/bin/env node

import { Command } from 'commander';

import BuildCommand from './commands/BuildCommand.js';

const program = new Command('openapi-type-gen');

program.description('OpenAPI Type Generation scripts').addCommand(BuildCommand);

await program.parseAsync();

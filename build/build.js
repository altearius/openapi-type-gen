#!/usr/bin/env node

import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { chmod } from 'node:fs/promises';

const compiled = spawnSync(
	'yarn',
	['tsc', '--build', resolve('src', 'tsconfig.json')],
	{
		stdio: 'inherit'
	}
).status;

if (compiled !== 0) {
	process.exit(compiled);
}

const executable = 0o755;
await chmod(resolve('dist', 'openapi-type-gen.js'), executable);

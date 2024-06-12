import { writeFile } from 'node:fs/promises';
import type { OpenAPI3 } from 'openapi-typescript';
import { format } from 'prettier';
import ResolveConfig from '../ResolveConfig.js';
import TryCompile from './TryCompile.js';

export default async function CompileTypes(
	schema: OpenAPI3,
	rootPath: string,
	target: string,
	fast: boolean
) {
	const compilePromise = TryCompile(schema, rootPath, fast);

	if (fast) {
		const compiled = await compilePromise;

		return compiled
			? async () => writeFile(target, compiled, 'utf-8')
			: undefined;
	}

	const [compiled, formatOptions] = await Promise.all([
		compilePromise,
		ResolveConfig(target)
	]);

	if (!compiled) {
		return;
	}

	const formatted = await format(compiled, {
		...formatOptions,
		parser: 'typescript'
	});

	return async () => writeFile(target, formatted, 'utf-8');
}

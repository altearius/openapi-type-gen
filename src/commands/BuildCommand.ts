import type $RefParser from '@apidevtools/json-schema-ref-parser';
import c from 'ansi-colors';
import { Argument, Command } from 'commander';
import { YAMLException } from 'js-yaml';
import type { OpenAPI3 } from 'openapi-typescript';
import CompileRoot from '../compile/root/CompileRoot.js';
import CompileTypes from '../compile/types/CompileTypes.js';
import CompileValidation from '../compile/validation/CompileValidation.js';
import HumanPath from '../util/HumanPath.js';
import Log from '../util/Log.js';
import ResolvePaths from '../util/ResolvePaths.js';

const BuildCommand = new Command('build');

BuildCommand.description('Compile an OpenAPI specification.');

const template = new Argument('<template>', 'A template OpenAPI file.');
BuildCommand.addArgument(template);

BuildCommand.option('--no-types', 'Skip type compilation.');
BuildCommand.option('--no-validation', 'Skip validation compilation.');
BuildCommand.option('-f, --fast', 'Skip optimization and formatting steps.');
BuildCommand.option('-v, --verbose', 'Enable verbose logging.');

interface IBuildOptions {
	readonly types: boolean;
	readonly validation: boolean;
	readonly fast: boolean;
	readonly verbose: boolean;
}

BuildCommand.action(async (rawTemplatePath: string, opts: IBuildOptions) => {
	if (opts.verbose) {
		Log.verbose = true;
	}

	const paths = ResolvePaths(rawTemplatePath);

	const startTime = Date.now();
	let root: Awaited<ReturnType<typeof CompileRoot>>;

	try {
		root = await CompileRoot(paths.templatePath, paths.rootPath, opts.fast);
	} catch (ex: unknown) {
		if (ex instanceof YAMLException) {
			Log.error(ex);
			BuildCommand.error('Build failed', { exitCode: 1 });
			return;
		}

		throw ex;
	}

	if (!root) {
		return;
	}

	const results = await Promise.allSettled([
		tryCompileTypes(root.schema, paths, opts),
		tryCompileValidation(root.schema, paths, opts)
	]);

	const fulfilled = results.filter(
		(f): f is PromiseFulfilledResult<() => Promise<void>> =>
			f.status === 'fulfilled' && f.value !== undefined
	);

	// Only output if no errors were thrown.
	if (fulfilled.length < results.length) {
		BuildCommand.error('Build failed', { exitCode: 1 });
	}

	const finalizers = [...fulfilled.map((f) => f.value), root.finalizer];
	await Promise.allSettled(finalizers.map(async (f) => f()));
	logCompletion(startTime, paths, opts);
});

export default BuildCommand;

function logCompletion(
	startTime: number,
	paths: ReturnType<typeof ResolvePaths>,
	{ types, validation }: IBuildOptions
) {
	const diff = Date.now() - startTime;

	const msgs = [
		'Compiled',
		HumanPath(paths.templatePath),
		'in',
		c.yellowBright(`${diff.toLocaleString()}ms`),
		`to:\n\t${c.greenBright('Schema')}:     `,
		HumanPath(paths.rootPath)
	];

	if (types) {
		msgs.push(`\n\t${c.greenBright('Definitions:')}`);
		msgs.push(HumanPath(paths.typesPath));
	}

	if (validation) {
		msgs.push(`\n\t${c.greenBright('Validation: ')}`);
		msgs.push(HumanPath(paths.validationPath));
	}

	Log.info(...msgs);
}

async function tryCompileTypes(
	schema: unknown,
	{ rootPath, typesPath }: ReturnType<typeof ResolvePaths>,
	{ fast, types }: IBuildOptions
) {
	if (!types) {
		return Promise.resolve(() => undefined);
	}

	try {
		return await CompileTypes(schema as OpenAPI3, rootPath, typesPath, fast);
	} catch (ex: unknown) {
		Log.error(
			'Failed to compile types:',
			ex instanceof Error ? ex.message : ex
		);
	}
}

async function tryCompileValidation(
	schema: unknown,
	{ rootPath, validationPath }: ReturnType<typeof ResolvePaths>,
	{ fast, validation }: IBuildOptions
) {
	if (!validation) {
		return Promise.resolve(() => undefined);
	}

	try {
		return await CompileValidation(
			schema as $RefParser.JSONSchema,
			rootPath,
			validationPath,
			fast
		);
	} catch (ex: unknown) {
		Log.error(
			'Failed to compile validation:',
			ex instanceof Error ? ex.message : ex
		);
	}
}

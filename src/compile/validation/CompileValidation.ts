import type $RefParser from '@apidevtools/json-schema-ref-parser';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { writeFile } from 'node:fs/promises';
import { format } from 'prettier';
import ResolveConfig from '../ResolveConfig.js';
import CreateAjvInstance from './CreateAjvInstance.js';
import EnsureModule from './EnsureModule.js';
import LoadOpenApiDocument from './LoadOpenApiDocument.js';
import TransformCjsToEsm from './TransformCjsToEsm.js';

export default async function CompileValidation(
	schema: $RefParser.JSONSchema,
	rootPath: string,
	target: string,
	fast: boolean
) {
	const [doc, config] = await Promise.all([
		LoadOpenApiDocument(schema, rootPath),
		ResolveConfig(target)
	]);

	if (doc === undefined) {
		return;
	}

	const ajv = CreateAjvInstance(doc, fast);
	if (!ajv) {
		return;
	}

	const validationCode = standaloneCode.default(ajv);
	const transformed = TransformCjsToEsm(validationCode);
	const ensureModule = EnsureModule(transformed);

	if (fast) {
		return async () => writeFile(target, ensureModule, 'utf-8');
	}

	const formatted = await format(ensureModule, {
		...config,
		parser: 'typescript'
	});

	return async () => writeFile(target, formatted, 'utf-8');
}

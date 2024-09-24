import type $RefParser from '@apidevtools/json-schema-ref-parser';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { writeFile } from 'node:fs/promises';
import { format } from 'prettier';
import ResolveConfig from '../ResolveConfig.js';
import CreateAjvInstance from './CreateAjvInstance.js';
import LoadOpenApiDocument from './LoadOpenApiDocument.js';

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

	if (fast) {
		return async () => writeFile(target, validationCode, 'utf-8');
	}

	const formatted = await format(validationCode, {
		...config,
		parser: 'typescript'
	});

	return async () => writeFile(target, formatted, 'utf-8');
}

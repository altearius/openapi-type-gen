import type $RefParser from '@apidevtools/json-schema-ref-parser';
import { dereference } from '@apidevtools/json-schema-ref-parser';
import { dirname, sep } from 'node:path';
import type { OpenAPIV3_1 } from 'openapi-types';
import HumanPath from '../../util/HumanPath.js';
import Log from '../../util/Log.js';

export default async function LoadOpenApiDocument(
	schema: $RefParser.JSONSchema,
	rootPath: string
): Promise<OpenAPIV3_1.Document | undefined> {
	const cwd = dirname(rootPath) + sep;

	try {
		const result: OpenAPIV3_1.Document = await dereference(
			cwd + '/',
			schema,
			{}
		);

		return result;
	} catch (ex: unknown) {
		if (!(ex instanceof Error)) {
			throw ex;
		}

		if (!('source' in ex) || typeof ex.source !== 'string') {
			throw ex;
		}

		if ('ioErrorCode' in ex && ex.ioErrorCode === 'ENOENT') {
			Log.error('File not found:', HumanPath(ex.source));
			return;
		}

		Log.error(
			'Failed to load schema from',
			`${HumanPath(ex.source)}:`,
			ex.message
		);
	}
}

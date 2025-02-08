import { dereference } from '@apidevtools/json-schema-ref-parser';
import { dirname, sep } from 'node:path';
import type { OpenAPIV3_1 } from 'openapi-types';
import HumanPath from '../../util/HumanPath.js';
import Log from '../../util/Log.js';

export default async function LoadOpenApiDocument(
	schema: unknown,
	rootPath: string
): Promise<OpenAPIV3_1.Document | undefined> {
	const cwd = dirname(rootPath) + sep;

	// I'm getting a race condition if I attempt to use dereference and
	// openapiTS at the same time. I suspect one of the two is mutating the
	// schema, and one is causing the other to fail. I don't know which is
	// at fault, but the JSON.parse(JSON.stringify(schema)) is an attempt
	// to resolve it by creating a copy to work with.

	try {
		const result: OpenAPIV3_1.Document = await dereference(
			cwd + '/',
			JSON.parse(JSON.stringify(schema)),
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

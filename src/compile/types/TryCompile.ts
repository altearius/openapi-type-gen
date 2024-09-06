import type { OpenAPI3, OpenAPITSOptions } from 'openapi-typescript';
import openapiTS, { astToString } from 'openapi-typescript';
import HumanPath from '../../util/HumanPath.js';
import Log from '../../util/Log.js';

export default async function TryCompile(
	schema: OpenAPI3,
	rootPath: string,
	fast: boolean
) {
	const typeOptions: OpenAPITSOptions = {
		alphabetize: !fast,
		cwd: rootPath,
		immutable: true
	};

	let ast: Awaited<ReturnType<typeof openapiTS>>;

	try {
		ast = await openapiTS(schema, typeOptions);
	} catch (ex: unknown) {
		if (ex instanceof Error) {
			if (
				'code' in ex &&
				ex.code === 'ENOENT' &&
				'path' in ex &&
				typeof ex.path === 'string'
			) {
				Log.error('File not found:', HumanPath(ex.path));
				return;
			}

			throw ex;
		}

		Log.error('Failed to compile:', ex);
		throw new Error('Failed to compile');
	}

	return astToString(ast);
}

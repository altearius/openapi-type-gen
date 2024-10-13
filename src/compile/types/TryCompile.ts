import type { OpenAPI3, OpenAPITSOptions } from 'openapi-typescript';
import openapiTS, { astToString } from 'openapi-typescript';
import { factory } from 'typescript';
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
		immutable: true,
		// See https://github.com/openapi-ts/openapi-typescript/issues/1214
		transform({ format, nullable }, { path }) {
			if (format !== 'binary' || !path) {
				return;
			}

			const typeName = path.includes('multipart~1form-data')
				? 'File'
				: path.includes('application~1octet-stream')
					? 'Blob'
					: null;

			if (!typeName) {
				return;
			}

			const node = factory.createTypeReferenceNode(typeName);

			return nullable
				? factory.createUnionTypeNode([
						node,
						factory.createTypeReferenceNode('null')
					])
				: node;
		}
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

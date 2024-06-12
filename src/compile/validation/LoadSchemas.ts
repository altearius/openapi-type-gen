import c from 'ansi-colors';
import type { OpenAPIV3_1 } from 'openapi-types';
import { OpenAPIV3 } from 'openapi-types';
import ExtractPathParameterSchema from './ExtractPathParameterSchema.js';
import ExtractRequestBodySchema from './ExtractRequestBodySchema.js';

export default function* LoadSchemas(doc: OpenAPIV3_1.Document) {
	const ids = new Set<string>();

	for (const [name, pathItem] of Object.entries(doc.paths ?? {})) {
		if (!pathItem) {
			continue;
		}

		for (const verb of Object.values(OpenAPIV3.HttpMethods)) {
			const operation = pathItem[verb];
			if (!operation?.operationId) {
				continue;
			}

			const human = c.yellowBright(`${verb.toUpperCase()}: ${name}`);
			const requestBodySchema = ExtractRequestBodySchema(operation, human);

			if (requestBodySchema && !ids.has(requestBodySchema.$id)) {
				ids.add(requestBodySchema.$id);
				yield requestBodySchema;
			}

			const pathParameterSchema = ExtractPathParameterSchema(
				pathItem,
				operation,
				human
			);

			if (pathParameterSchema && !ids.has(pathParameterSchema.$id)) {
				ids.add(pathParameterSchema.$id);
				yield pathParameterSchema;
			}
		}
	}
}

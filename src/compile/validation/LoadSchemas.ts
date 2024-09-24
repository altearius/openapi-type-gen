import { styleText } from 'node:util';
import type { OpenAPIV3_1 } from 'openapi-types';
import { OpenAPIV3 } from 'openapi-types';
import request from './extract-schema/request.js';
import requestBody from './extract-schema/requestBody.js';

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

			const human = styleText('yellowBright', `${verb.toUpperCase()}: ${name}`);
			const requestBodySchema = requestBody(human, operation);

			if (requestBodySchema && !ids.has(requestBodySchema.$id)) {
				ids.add(requestBodySchema.$id);
				yield requestBodySchema;
			}

			const requestSchema = request(human, pathItem, operation);

			if (requestSchema && !ids.has(requestSchema.$id)) {
				ids.add(requestSchema.$id);
				yield requestSchema;
			}
		}
	}
}

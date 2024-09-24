import { styleText } from 'node:util';
import type { OpenAPIV3_1 } from 'openapi-types';
import Log from '../../../util/Log.js';
import type SchemaWithId from '../SchemaWithId.js';
import { isSchemaWithId } from '../SchemaWithId.js';

export default function requestBody(
	human: string,
	{ requestBody: definition }: Pick<OpenAPIV3_1.OperationObject, 'requestBody'>
): SchemaWithId | undefined {
	if (definition === undefined) {
		Log.debug(human, styleText('grey', 'has no requestBody.'));
		return;
	}

	if (!('content' in definition)) {
		Log.debug(human, styleText('grey', 'has no content.'));
		return;
	}

	const schema = definition.content['application/json']?.schema;

	if (schema === undefined) {
		Log.debug(human, styleText('grey', 'has no JSON schema.'));
		return;
	}

	if ('$ref' in schema) {
		Log.debug(human, styleText('grey', 'has a reference.'));
		return;
	}

	if (!isSchemaWithId(schema)) {
		Log.warn(human, 'has no $id.');
		return;
	}

	Log.debug(
		human,
		'has a',
		styleText('yellowBright', 'requestBody'),
		'schema:',
		styleText('yellowBright', schema.$id)
	);

	return schema;
}

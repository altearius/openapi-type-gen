import { styleText } from 'node:util';
import type { OpenAPIV3_1 } from 'openapi-types';
import Log from '../../util/Log.js';
import type ISchemaWithId from './ISchemaWithId.js';
import IsSchemaWithId from './IsSchemaWithId.js';

export default function ExtractRequestBodySchema(
	{ requestBody }: OpenAPIV3_1.OperationObject,
	human: string
): ISchemaWithId | undefined {
	if (requestBody === undefined) {
		Log.debug(human, styleText('grey', 'has no requestBody.'));
		return;
	}

	if (!('content' in requestBody)) {
		Log.debug(human, styleText('grey', 'has no content.'));
		return;
	}

	const schema = requestBody.content['application/json']?.schema;

	if (schema === undefined) {
		Log.debug(human, styleText('grey', 'has no JSON schema.'));
		return;
	}

	if ('$ref' in schema) {
		Log.debug(human, styleText('grey', 'has a reference.'));
		return;
	}

	if (!IsSchemaWithId(schema)) {
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

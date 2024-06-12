import { styleText } from 'node:util';
import type { OpenAPIV3_1 } from 'openapi-types';
import Log from '../../util/Log.js';
import CollectParameters from './CollectParameters.js';
import SortParameters from './SortParameters.js';

export default function ExtractPathParameterSchema(
	pathItem: OpenAPIV3_1.PathItemObject | undefined,
	{
		operationId = '',
		parameters: operationParameters = []
	}: OpenAPIV3_1.OperationObject,
	human: string
) {
	const { parameters: pathParameters = [] } = pathItem ?? {};

	const parameters = [
		...CollectParameters(pathParameters),
		...CollectParameters(operationParameters)
	].reduce(
		(map, { name, schema }) => map.set(name, schema),
		new Map<string, OpenAPIV3_1.SchemaObject>()
	);

	if (parameters.size === 0) {
		Log.debug(human, styleText('grey', 'has no path parameters'));
		return;
	}

	Log.debug(
		human,
		'has a',
		styleText('yellowBright', 'path parameter'),
		'schema'
	);

	return {
		...SortParameters(parameters),
		$id: `${operationId.replace(/[^\w]/giu, '_')}_path_parameters`,
		additionalProperties: false,
		type: 'object'
	};
}

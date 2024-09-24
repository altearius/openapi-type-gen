import { styleText } from 'node:util';
import type { OpenAPIV3_1 } from 'openapi-types';
import Log from '../../../util/Log.js';
import type SchemaWithId from '../SchemaWithId.js';
import collect from './collect.js';
import groupByLocation from './groupByLocation.js';
import toSchema from './toSchema.js';

export default function request(
	human: string,
	{
		parameters: pathParameters = []
	}: Pick<OpenAPIV3_1.PathItemObject, 'parameters'>,
	{
		operationId = '',
		parameters: operationParameters = []
	}: Pick<OpenAPIV3_1.OperationObject, 'operationId' | 'parameters'>
): SchemaWithId | undefined {
	const collection = collect(pathParameters, operationParameters);
	const grouped = groupByLocation(human, collection);

	if (grouped.size === 0) {
		Log.debug(human, styleText('grey', 'has no request parameters'));
		return;
	}

	Log.debug(human, 'has a', styleText('yellowBright', 'request'), 'schema');

	return {
		...toSchema(grouped, (location) => toSchema(location)),
		$id: `${operationId.replace(/[^\w]/giu, '_')}_request_parameters`
	};
}

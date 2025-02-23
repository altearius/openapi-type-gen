import type { SchemaObject } from 'ajv';
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

	const schema = toSchema(grouped);
	return configureSchema(operationId, schema);
}

function configureSchema(
	operationId: string,
	schema: SchemaObject
): SchemaWithId {
	if (!('properties' in schema)) {
		throw new Error('Expected schema to have properties');
	}

	const properties: unknown = schema.properties;

	if (properties === null) {
		throw new Error('Expected properties to have a value');
	}

	if (typeof properties !== 'object') {
		throw new Error('Expected properties to be an object');
	}

	return {
		...schema,
		$id: `${operationId.replace(/[^\w]/giu, '_')}_request_parameters`,
		additionalProperties: false,
		properties: configureProperties(properties as Record<string, unknown>)
	};
}

function configureProperties(properties: Record<string, unknown>) {
	return Object.fromEntries(
		Object.entries(properties).map(([key, value]) => {
			if (typeof value !== 'object') {
				throw new Error('Expected value to be an object');
			}

			const additionalProperties = key !== 'path';
			return [key, { ...value, additionalProperties }];
		})
	);
}

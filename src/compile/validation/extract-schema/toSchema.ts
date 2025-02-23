import type { SchemaObject } from 'ajv';
import type groupByLocation from './groupByLocation.js';
import type ParameterLocation from './ParameterLocation.js';

export default function toSchema(
	group: ReturnType<typeof groupByLocation>
): SchemaObject {
	const requestSchemaProperties: Record<string, SchemaObject> = {};
	const requiredLocations = new Set<ParameterLocation>();

	for (const [location, parameters] of sortedEntries(group)) {
		const locationProperties: Record<string, SchemaObject> = {};
		const locationRequired: string[] = [];

		for (const [name, parameter] of sortedEntries(parameters)) {
			if (Object.keys(parameter.schema).length === 0) {
				continue;
			}

			if (location === 'path' || parameter.required) {
				locationRequired.push(name);
				requiredLocations.add(location);
			}

			locationProperties[name] = parameter.schema;
		}

		requestSchemaProperties[location] = {
			properties: locationProperties,
			...(locationRequired.length > 0 ? { required: locationRequired } : {}),
			type: 'object' as const
		};
	}

	return {
		properties: requestSchemaProperties,
		...(requiredLocations.size > 0
			? { required: [...requiredLocations].sort() }
			: {}),
		type: 'object' as const
	};
}

function* sortedEntries<TKey, TValue>(map: ReadonlyMap<TKey, TValue>) {
	const sortedKeys = [...map.keys()].sort();

	for (const key of sortedKeys) {
		const value = map.get(key);
		yield [key, value as TValue] as const;
	}
}

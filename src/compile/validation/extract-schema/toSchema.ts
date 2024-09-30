import type { SchemaObject } from 'ajv';

export default function toSchema<TValue>(
	group: ReadonlyMap<string, TValue>,
	mapValue?: (value: TValue) => SchemaObject
): SchemaObject {
	const sortedKeys = [...group.keys()].sort();
	const properties: Record<string, SchemaObject> = {};

	for (const key of sortedKeys) {
		const value = getRequired(group, key);
		properties[key] = mapValue ? mapValue(value) : (value as SchemaObject);
	}

	return {
		properties,
		required: sortedKeys,
		type: 'object' as const
	};
}

function getRequired<TKey, TValue>(
	map: ReadonlyMap<TKey, TValue>,
	key: TKey
): TValue {
	const result = map.get(key);
	if (result === undefined) {
		throw new Error(`Missing required key: ${String(key)}`);
	}

	return result;
}

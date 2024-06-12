import type { OpenAPIV3_1 } from 'openapi-types';

export default function SortParameters(
	parameters: ReadonlyMap<string, OpenAPIV3_1.SchemaObject>
) {
	const sortedKeys = [...parameters.keys()].sort();

	const properties = sortedKeys.reduce<
		NonNullable<OpenAPIV3_1.SchemaObject['properties']>
	>((map, key) => {
		const schema = parameters.get(key);
		if (schema) {
			map[key] = schema;
		}

		return map;
	}, {});

	return {
		properties,
		required: sortedKeys
	};
}

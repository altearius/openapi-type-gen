import type { OpenAPIV3_1 } from 'openapi-types';
import type Parameter from './Parameter.js';
import { isParameterLocation } from './ParameterLocation.js';

type ParameterSource = readonly (
	| OpenAPIV3_1.ParameterObject
	| OpenAPIV3_1.ReferenceObject
)[];

export default function* collect(
	...sources: readonly ParameterSource[]
): Generator<Parameter> {
	for (const source of sources) {
		for (const obj of source) {
			if ('$ref' in obj) {
				throw new Error('Parameter sources must be dereferenced first.');
			}

			const { in: location, name, required = false, schema } = obj;
			if (schema === undefined) {
				continue;
			}

			if ('$ref' in schema) {
				throw new Error('Parameter schemas must be dereferenced first.');
			}

			if (!isParameterLocation(location)) {
				throw new Error('Invalid parameter location.');
			}

			yield { location, name, required, schema };
		}
	}
}

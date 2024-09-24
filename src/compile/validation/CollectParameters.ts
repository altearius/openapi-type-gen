import type { OpenAPIV3_1 } from 'openapi-types';
import { isParameterLocation } from './ParameterLocation.js';
import type PathParameters from './PathParameters.js';

export default function* CollectParameters(parameters: PathParameters) {
	if (!validParameters(parameters)) {
		return;
	}

	for (const { in: location, name, schema } of parameters) {
		if (
			schema === undefined ||
			'$ref' in schema ||
			!isParameterLocation(location)
		) {
			continue;
		}

		yield { location, name, schema };
	}
}

function validParameters(
	parameters: PathParameters
): parameters is OpenAPIV3_1.ParameterObject[] {
	return Array.isArray(parameters) && parameters.every((p) => !('$ref' in p));
}

import type { SchemaObject } from 'ajv';
import { styleText } from 'node:util';
import Log from '../../../util/Log.js';
import type Parameter from './Parameter.js';
import type ParameterLocation from './ParameterLocation.js';

export default function groupByLocation(
	human: string,
	parameters: Generator<Parameter>
): ReadonlyMap<ParameterLocation, ReadonlyMap<string, SchemaObject>> {
	type NamedSchema = Map<string, SchemaObject>;
	const groups = new Map<ParameterLocation, NamedSchema>();

	for (const parameter of parameters) {
		let group = groups.get(parameter.location);
		if (!group) {
			group = new Map<string, SchemaObject>();
			groups.set(parameter.location, group);
		}

		if (group.has(parameter.name)) {
			Log.warn(
				human,
				'has a duplicate parameter:',
				styleText('yellowBright', parameter.name),
				'in the',
				styleText('yellowBright', parameter.location),
				'collection'
			);

			continue;
		}

		group.set(parameter.name, parameter.schema);
	}

	return groups;
}

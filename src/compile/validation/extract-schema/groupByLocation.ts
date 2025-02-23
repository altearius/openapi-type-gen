import { styleText } from 'node:util';
import Log from '../../../util/Log.js';
import type Parameter from './Parameter.js';
import type ParameterLocation from './ParameterLocation.js';

export default function groupByLocation(
	human: string,
	parameters: Generator<Parameter>
): ReadonlyMap<ParameterLocation, ReadonlyMap<string, Parameter>> {
	const groups = new Map<ParameterLocation, Map<string, Parameter>>();

	for (const parameter of parameters) {
		let group = groups.get(parameter.location);
		if (!group) {
			group = new Map<string, Parameter>();
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

		group.set(parameter.name, parameter);
	}

	return groups;
}

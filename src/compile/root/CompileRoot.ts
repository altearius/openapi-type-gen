import { Compose } from '@altearius/openapi-compose';
import yaml from 'js-yaml';
import { writeFile } from 'node:fs/promises';
import { format } from 'prettier';
import Log from '../../util/Log.js';
import ResolveConfig from '../ResolveConfig.js';

export default async function CompileRoot(
	templatePath: string,
	targetPath: string,
	fast: boolean
) {
	const schema = await Compose(templatePath, targetPath, Log);
	if (!schema) {
		return;
	}

	const fileOutput = yaml.dump(schema);

	if (fast) {
		return {
			finalizer: async () => writeFile(targetPath, fileOutput, 'utf8'),
			schema
		};
	}

	const formatted = await format(fileOutput, {
		...(await ResolveConfig(targetPath)),
		parser: 'yaml'
	});

	return {
		finalizer: async () => writeFile(targetPath, formatted, 'utf8'),
		schema
	};
}

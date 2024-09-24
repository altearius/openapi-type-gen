import { basename, dirname, extname, resolve } from 'node:path';

export default function ResolvePaths(rawTemplatePath: string) {
	const templatePath = resolve(rawTemplatePath);
	const templateDir = dirname(templatePath);
	const ext = extname(templatePath);
	const name = basename(templatePath, `.template${ext}`);

	if (name === basename(templatePath)) {
		throw new Error('Template must end with .template.yaml or .template.json');
	}

	const rootPath = resolve(templateDir, `${name}.yaml`);
	const typesPath = resolve(templateDir, `${name}.d.yaml.ts`);
	const validationPath = resolve(templateDir, `${name}.validation.cjs`);

	return {
		rootPath,
		templatePath,
		typesPath,
		validationPath
	};
}

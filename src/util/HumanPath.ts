import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';

export default function HumanPath(path: URL | string) {
	const x = path instanceof URL ? fileURLToPath(path) : path;
	return styleText('yellowBright', relative(process.cwd(), x));
}

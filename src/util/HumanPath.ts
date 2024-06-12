import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import c from 'ansi-colors';

export default function HumanPath(path: URL | string) {
	const x = path instanceof URL ? fileURLToPath(path) : path;
	return c.yellowBright(relative(process.cwd(), x));
}

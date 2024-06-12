import type { Options } from 'prettier';
import { resolveConfig } from 'prettier';

const cache = new Map<string, Promise<Options | null>>();

export default async function ResolveConfig(target: URL | string) {
	const key = target.toString();

	const existing = cache.get(key);
	if (existing) {
		return existing;
	}

	const promise = resolveConfig(target, { editorconfig: true });
	cache.set(key, promise);
	return promise;
}

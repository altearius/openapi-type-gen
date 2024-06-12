export default function EnsureModule(source: string): string {
	if (source === '"use strict";') {
		return source + '\nexport default {};';
	}

	return source;
}

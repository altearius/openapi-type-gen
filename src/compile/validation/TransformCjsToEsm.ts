// Workaround for https://github.com/ajv-validator/ajv/issues/2209
export default function TransformCjsToEsm(source: string): string {
	return source.replace(
		/\brequire\((?<path>'(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*")\)\.default\b/gu,
		(_, path: string) => {
			const withExtension = path.slice(0, -1) + '.js' + path.slice(-1);

			// The strange `.default.default` syntax is necessary and I do not fully
			// understand why.
			return `(await import(${withExtension})).default.default`;
		}
	);
}

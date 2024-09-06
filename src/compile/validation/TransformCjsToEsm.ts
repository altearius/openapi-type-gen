// Workaround for https://github.com/ajv-validator/ajv/issues/2209
export default function TransformCjsToEsm(source: string): string {
	return source.replace(
		/\brequire\((?<path>'(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*")\)/gu,
		(_, path: string) => {
			const withExtension = path.slice(0, -1) + '.js' + path.slice(-1);
			return `(await import(${withExtension}))`;
		}
	);
}

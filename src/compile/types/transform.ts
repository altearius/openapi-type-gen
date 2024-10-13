import type { SchemaObject, TransformNodeOptions } from 'openapi-typescript';
import { factory } from 'typescript';

// See https://github.com/openapi-ts/openapi-typescript/issues/1214
export default function transform(
	{ format, nullable }: SchemaObject,
	{ path }: TransformNodeOptions
) {
	if (format !== 'binary' || !path) {
		return;
	}

	const typeName = resolveTypeName(path);

	if (!typeName) {
		return;
	}

	const node = factory.createTypeReferenceNode(typeName);

	if (!nullable) {
		return node;
	}

	const types = [node, factory.createTypeReferenceNode('null')];
	return factory.createUnionTypeNode(types);
}

function resolveTypeName(path: string) {
	if (path.includes('multipart~1form-data')) {
		return 'File';
	}

	if (path.includes('application~1octet-stream')) {
		return 'Blob';
	}
}

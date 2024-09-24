import type { OpenAPIV3_1 } from 'openapi-types';

type SchemaWithId = OpenAPIV3_1.SchemaObject & { readonly $id: string };
export default SchemaWithId;

export function isSchemaWithId(o: OpenAPIV3_1.SchemaObject): o is SchemaWithId {
	return '$id' in o && typeof o.$id === 'string';
}

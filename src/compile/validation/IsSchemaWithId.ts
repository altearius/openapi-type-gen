import type { OpenAPIV3_1 } from 'openapi-types';
import type ISchemaWithId from './ISchemaWithId.js';

export default function IsSchemaWithId(
	o: OpenAPIV3_1.SchemaObject
): o is ISchemaWithId {
	return '$id' in o && typeof o.$id === 'string';
}

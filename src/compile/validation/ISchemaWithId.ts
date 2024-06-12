import type { OpenAPIV3_1 } from 'openapi-types';

type ISchemaWithId = OpenAPIV3_1.SchemaObject & { readonly $id: string };
export default ISchemaWithId;

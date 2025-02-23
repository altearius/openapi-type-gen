import type { OpenAPIV3_1 } from 'openapi-types';
import type ParameterLocation from './ParameterLocation.js';

export default interface Parameter {
	readonly location: ParameterLocation;
	readonly name: string;
	readonly required: boolean;
	readonly schema: NonNullable<OpenAPIV3_1.ParameterObject['schema']>;
}

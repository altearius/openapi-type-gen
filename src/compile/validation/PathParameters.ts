import type { OpenAPIV3_1 } from 'openapi-types';

type PathParameters = NonNullable<
	NonNullable<OpenAPIV3_1.Document['paths']>[string]
>['parameters'];

export default PathParameters;

import { Ajv } from 'ajv';
import c from 'ansi-colors';
import type { OpenAPIV3_1 } from 'openapi-types';
import Log from '../../util/Log.js';
import LoadSchemas from './LoadSchemas.js';

export default function CreateAjvInstance(
	doc: OpenAPIV3_1.Document,
	fast: boolean
) {
	const optimizationPasses = 2;
	const optimize = fast ? false : optimizationPasses;

	const ajv = new Ajv({
		code: { esm: true, optimize, source: true },
		strict: true
	});

	for (const schema of LoadSchemas(doc)) {
		try {
			ajv.addSchema(schema);
		} catch (ex: unknown) {
			if (!(ex instanceof Error)) {
				throw ex;
			}

			const invalidSchema = /^schema is invalid: (?<reason>.*)$/iu;

			const { groups: { reason = '' } = {} } =
				invalidSchema.exec(ex.message) ?? {};

			if (reason && '$id' in schema) {
				Log.error(
					'Schema',
					c.yellowBright(schema.$id),
					'is invalid:',
					c.yellowBright(reason)
				);

				return;
			}

			throw ex;
		}
	}

	return ajv;
}

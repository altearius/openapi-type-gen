import { Ajv } from 'ajv';
import addFormats from 'ajv-formats';
import { styleText } from 'node:util';
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
		code: { esm: false, optimize, source: true },
		strict: true
	});

	addFormats.default(ajv);

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
					styleText('yellowBright', schema.$id),
					'is invalid:',
					styleText('yellowBright', reason)
				);

				return;
			}

			throw ex;
		}
	}

	return ajv;
}

import { generate } from '../src/generator/generate';
import { IGenerationOptions } from '../src/i-generation-options';
import { EIdType, EType, ISchema } from '../src/i-schema';

describe('Generate',  () => {
	const schema: ISchema = {
		id: EIdType.uuid,
		name: 'Test',
		properties: [
			{ name: 'test', type: EType.string }
		],
	};
	const options: IGenerationOptions = {
		resultsPath: './tests/result'
	};

	it('should generate',  () => {
		generate(schema, options);
	});
});
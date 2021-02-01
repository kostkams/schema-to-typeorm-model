import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import ts, { CompilerOptions, ModuleKind, ScriptTarget } from 'typescript';
import { IGenerationOptions } from '../i-generation-options';
import { EIdType, EType, ISchema } from '../i-schema';

const tsOptions: CompilerOptions = {
	emitDecoratorMetadata: true,
	experimentalDecorators: true,
	module: ModuleKind.CommonJS,
	strict: true,
	lib: ['ES6'],
	target: ScriptTarget.ES2016,
};

export const generate = (jsonSchema: ISchema, options: IGenerationOptions): void => {
	createHandlebarsHelpers();

	if (!fs.existsSync(options.resultsPath)) {
		fs.mkdirSync(options.resultsPath);
	}
	check(jsonSchema);

	generateEntities(jsonSchema, options);
};

const generateEntities = (jsonSchema: ISchema, options: IGenerationOptions): void => {
	const templatePath = path.resolve(
		__dirname,
		'..',
		'..',
		'dist',
		'templates',
		'entity.mst'
	);
	const entityTemplate = fs.readFileSync(templatePath, 'utf-8');
	const entityCompiledTemplate = handlebars.compile(entityTemplate, { noEscape: true });

	const rendered = entityCompiledTemplate(jsonSchema);
	const result = ts.transpile(rendered, tsOptions);

	const resultFilePath = path.resolve(
		options.resultsPath,
		`${jsonSchema.name}.js`
	);

	fs.writeFileSync(resultFilePath, result, {
		encoding: 'utf-8',
		flag: 'w'
	});
};

const check = (jsonSchema: ISchema): void => {
	let error = '';
	if (jsonSchema.id === undefined) {
		error = 'id is required';
	}

	if (error) {
		throw new Error(error);
	}
};

const createHandlebarsHelpers = (): void => {
	handlebars.registerHelper('toEntityName', (name: string) => {
		return `${name.charAt(0).toUpperCase() + name.slice(1)}Entity`;
	});
	handlebars.registerHelper('toIdType', (type: EIdType) => {
		switch (type) {
		case EIdType.uuid:
			return 'uuid';
		case EIdType.number:
			return 'number';
		}
	});
	handlebars.registerHelper('toType', (type: EType) => {
		switch (type) {
		case EType.string:
			return 'string';
		case EType.boolean:
			return 'boolean';
		case EType.number:
			return 'number';
		case EType.date:
			return 'Date';
		}
	});
};
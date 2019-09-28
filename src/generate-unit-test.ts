import template = require('lodash/template');
import uniq = require('lodash/uniq');
import { ParsedSourceFile, ParsedClass, ClassOptions, TemplateOptions, DependencyHandler, ParsedImport, DependencyHandlerOptions } from './model';
import { basename } from 'path';
import { readFileSync } from 'fs';

export function generateUnitTest(path: string, sourceCode: string, input: ParsedSourceFile, handlers: DependencyHandler[]) {
    const klass = input.classes[0];

    if (!klass) {
        throw new Error(`No classes found in ${path}`);
    }

    const templateOptions = getTemplateOptions(klass.name);

    const templateText = readFileSync(templateOptions.templatePath).toString();
    const generator = template(templateText);
    const relativePath = './' + basename(path).replace('.ts', '');
    const usedImports = input.imports.reduce((imports, value) => {
        const matchingDependencies = value.names.filter((name) => {
            return klass.dependencies.some(dep => !!dep.type && dep.type.replace(/(<.*)/, '') === name);
        });
        if (matchingDependencies.length > 0) {
            imports.push({
                path: value.path,
                names: matchingDependencies
            });
        }
        return imports;
    }, [] as ParsedImport[]);

    const classOptions = getClassOptions(klass, handlers, {
        sourceCode,
        imports: usedImports,
        allImports: input.imports
    });

    const uniqueImports = getUniqueImports(usedImports);

    return generator({
        name: klass.name,
        path: relativePath,
        imports: uniqueImports,
        allImports: input.imports,
        ...classOptions,
        ...templateOptions
    });
}


function getClassOptions(klass: ParsedClass, handlers: DependencyHandler[], options: Partial<DependencyHandlerOptions>): ClassOptions {
    const result: ClassOptions = {
        declarations: [],
        initializers: [],
        dependencies: []
    };
    klass.dependencies.forEach(dep => {
        const offset = dep.name.indexOf('$') === 0 ? 1 : 0;
        const variableName = 'fake' + dep.name.charAt(offset).toUpperCase() + dep.name.slice(1 + offset);
        const injectionToken = dep.type && dep.type !== 'any' ? dep.type.replace(/(<.*)/, '') : dep.token;

        for (let i = 0; i < handlers.length; i++) {
            const handler = handlers[i];
            if (handler.test(dep)) {
                handler.run(result, dep, {
                    variableName,
                    injectionToken,
                    ...options as any
                });
                return;
            }
        }
    });
    return result;
}

function getUniqueImports(imports: ParsedImport[]): ParsedImport[] {
    const result: ParsedImport[] = [];
    let index = 0;
    while (index < imports.length) {
        const value = imports[index];
        result.push(value);
        index++;

        for (let i = imports.length - 1; i >= index; i--) {
            const target = imports[i];

            if (target.path === value.path) {
                value.names = uniq(value.names.concat(target.names));
                imports.splice(i, 1);
            }
        }
    }
    return result;
}

function getTemplateOptions(name: string): TemplateOptions {

    if (name.indexOf('Component') !== -1) {
        return {
            instanceVariableName: 'component',
            templateType: 'Component',
            templatePath: __dirname + '/../templates/component.ts.tpl'
        };
    } else if (name.indexOf('Directive') !== -1) {
        return {
            instanceVariableName: 'directive',
            templateType: 'Directive',
            templatePath: __dirname + '/../templates/component.ts.tpl'
        };
    } else if (name.indexOf('Service') !== -1) {
        return {
            instanceVariableName: 'service',
            templateType: 'Service',
            templatePath: __dirname + '/../templates/class.ts.tpl'
        };
    } else if (name.indexOf('Pipe') !== -1) {
        return {
            instanceVariableName: 'pipe',
            templateType: 'Pipe',
            templatePath: __dirname + '/../templates/class.ts.tpl'
        };
    } else {
        return {
            instanceVariableName: 'instance',
            templateType: 'Instance',
            templatePath: __dirname + '/../templates/class.ts.tpl'
        };
    }
}

import template = require('lodash/template');
import { ParsedSourceFile } from './parse-source-file';
import { basename } from 'path';
import { readFileSync } from 'fs';

export function generateUnitTest(path, sourceCode, input: ParsedSourceFile) {
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
    }, [] as ParsedSourceFile['imports']);

    return generator({
        name: klass.name,
        path: relativePath,
        imports: usedImports,
        dependencies: klass.dependencies.map(dep => {
            return {
                variableName: 'fake' + dep.name.charAt(0).toUpperCase() + dep.name.slice(1),
                injectionToken: dep.type ? dep.type.replace(/(<.*)/, '') : dep.token,
                usedMethods: getUsedMethods(sourceCode, dep.name),
                ...dep
            };
        }),
        ...templateOptions
    });
}

function getUsedMethods(sourceCode: string, variable: string) {
    const result: string[] = [];
    const regex = new RegExp(`${variable}\\\.([a-zA-Z0-9]+)[\\\(<]`, 'g');
    let matches: any;

    while (matches = regex.exec(sourceCode)) {
        if (result.indexOf(matches[1]) === -1) {
            result.push(decodeURIComponent(matches[1]));
        }
    }
    return result;
}

function getTemplateOptions(name: string) {

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
            instanceVariableName: 'Pipe',
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

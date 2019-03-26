import template = require('lodash/template');
import { ParsedSourceFile, ParsedClass } from './parse-source-file';
import { basename } from 'path';
import { readFileSync } from 'fs';

interface ClassOptions {
    declarations: { name: string, type: string }[];
    factories: { name: string, value: string }[];
    dependencies: { name: string, token: string }[];
}

interface TemplateOptions {
    instanceVariableName: string;
    templateType: string;
    templatePath: string;
}

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
        ...getClassOptions(klass, sourceCode),
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

function getClassOptions(klass: ParsedClass, sourceCode: string): ClassOptions {
    const result: ClassOptions = {
        declarations: [],
        factories: [],
        dependencies: []
    };
    klass.dependencies.forEach(dep => {
        const variableName = 'fake' + dep.name.charAt(0).toUpperCase() + dep.name.slice(1);
        const injectionToken = dep.type ? dep.type.replace(/(<.*)/, '') : dep.token;
        const usedMethods = getUsedMethods(sourceCode, dep.name);
        result.declarations.push({
            name: variableName,
            type: `jasmine.SpyObj<${dep.type || 'any'}>`
        });
        result.factories.push({
            name: variableName,
            value: `jasmine.createSpyObj<${dep.type || 'any'}>('${dep.type || dep.name}', ['${usedMethods.join("', '")}'])`
        });
        result.dependencies.push({
            name: variableName,
            token: injectionToken || 'no-token'
        });
    });
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

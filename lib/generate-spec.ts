import template = require('lodash/template');
import { ParsedSourceFile } from './parse-source-file';
import { basename } from 'path';
import { readFileSync } from 'fs';

export function generateSpec(path, sourceCode, input: ParsedSourceFile) {
    const klass = input.classes[0];
    const templateText = readFileSync(getTemplateFile(klass.name)).toString();
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
        })
    });
}

function getUsedMethods(sourceCode: string, variable: string) {
    const result: string[] = [];
    const regex = new RegExp(`${variable}\\\.([a-zA-Z0-9]+)[\\\(<]`, 'g');
    let matches: any;

    while (matches = regex.exec(sourceCode)) {
        result.push(decodeURIComponent(matches[1]));
    }
    return result;
}

function getTemplateFile(name: string) {
    if (name.indexOf('Component') !== -1) {
        return __dirname + '/../templates/component.ts.tpl';
    } else {
        return __dirname + '/../templates/class.ts.tpl';
    }
}

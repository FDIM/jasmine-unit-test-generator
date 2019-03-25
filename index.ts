#!/usr/bin/env node
// tslint:disable:no-console
import { readFileSync, writeFileSync } from 'fs';
import * as ts from 'typescript';
import template = require('lodash/template');
import { parseSourceFile, ParsedSourceFile } from './lib/parse-source-file';
import { basename } from 'path';

const path = process.argv[2];

if (!path) {
    // tslint:disable-next-line:no-console
    console.error('missing path argument');
    process.exit(1);
}

const specPath = path.substring(0, path.length - 2) + 'spec.ts';
const result = parseFile(path);

writeFileSync(specPath, generateSpec(result));

function parseFile(file: string): ParsedSourceFile {

    const sourceFile = ts.createSourceFile(
        file,
        readFileSync(file).toString(),
        ts.ScriptTarget.Latest,
        /*setParentNodes */ true
    );

    return parseSourceFile(sourceFile);
}

function generateSpec(input: ParsedSourceFile) {
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
        component: klass.name,
        path: relativePath,
        imports: usedImports,
        dependencies: klass.dependencies.map(dep => {
            return {
                variableName: 'fake' + dep.name.charAt(0).toUpperCase() + dep.name.slice(1),
                injectionToken: dep.type ? dep.type.replace(/(<.*)/, '') : dep.token,
                usedMethods: [],
                ...dep
            };
        })
    });
}

function getTemplateFile(name: string) {
    if (name.indexOf('Component') !== -1) {
        return __dirname + '/templates/component.ts.tpl';
    } else {
        return __dirname + '/templates/class.ts.tpl';
    }
}

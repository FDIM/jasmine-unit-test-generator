#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import * as ts from 'typescript';
import { parseSourceFile } from './lib/parse-source-file';
import { generateUnitTest } from './lib/generate-unit-test';

run(process.argv[2]);

function run(path: string) {

    if (!path) {
        // tslint:disable-next-line:no-console
        console.error('missing path argument');
        process.exit(1);
    }

    const specPath = path.substring(0, path.length - 2) + 'spec.ts';
    const sourceCode = readFileSync(path).toString();

    const sourceFile = ts.createSourceFile(
        path,
        sourceCode,
        ts.ScriptTarget.Latest,
        /*setParentNodes */ true
    );

    const input = parseSourceFile(sourceFile);
    const output = generateUnitTest(path, sourceCode, input);

    writeFileSync(specPath, output);
}

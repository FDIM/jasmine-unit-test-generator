# Jasmine unit test generator

[![Travis CI build](https://travis-ci.org/fdim/jasmine-unit-test-generator.svg)](https://travis-ci.org/fdim/jasmine-unit-test-generator)

Automates creation of initial unit test files taking dependencies into account.

Supported types:

* component
* directive
* service
* pipe
* class file (may not be useful depending on use case)

## usage

run `jasmine-unit-test-generator <path-to-file>`

### with custom handlers

run `jasmine-unit-test-generator --handlers <path-to-handlers-dir> <path-to-file>`

### custom handlers

You can extend formatting in spec files for each dependency by making a handler. See `default-dependency-handler.ts`.
It is possible to adjust declarations, initializers and dependencies. 

## development

run `npm run build:dev`

## release

run `npm run build`

run `npm publish`

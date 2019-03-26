import { ParsedClassDependency, ClassOptions, DependencyHandler } from '../model';
import { getUsedMethods } from './get-used-methods';

export default {
    run(result: ClassOptions, dep: ParsedClassDependency, options: {
        variableName: string,
        injectionToken?: string,
        sourceCode: string
    }) {
        const usedMethods = getUsedMethods(options.sourceCode, dep.name);

        result.declarations.push({
            name: options.variableName,
            type: `jasmine.SpyObj<${dep.type || 'any'}>`
        });
        result.initializers.push({
            name: options.variableName,
            value: `jasmine.createSpyObj<${dep.type || 'any'}>('${dep.type === 'any' || !dep.type ? dep.name : dep.type}', ['${usedMethods.join("', '")}'])`
        });
        result.dependencies.push({
            name: options.variableName,
            token: options.injectionToken || 'no-token'
        });
    },

    test() {
        return true;
    }
} as DependencyHandler;

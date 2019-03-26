
export interface ParsedClass {
    name: string;
    dependencies: ParsedClassDependency[];
}

export interface ParsedClassDependency {
    name: string;
    type?: string;
    token?: string;
}
export interface ParsedImport {
    path: string;
    names: string[];
}

export interface ParsedSourceFile {
    imports: ParsedImport[];
    classes: ParsedClass[];
}

export interface ClassOptions {
    declarations: { name: string, type: string }[];
    initializers: { name?: string, value: string }[];
    dependencies: { name: string, token: string }[];
}

export interface TemplateOptions {
    instanceVariableName: string;
    templateType: string;
    templatePath: string;
}

export interface DependencyHandler {
    run(result: ClassOptions, dep: ParsedClassDependency, options: {
        variableName: string,
        injectionToken?: string,
        sourceCode: string,
        imports: ParsedImport[]
    }): void

    test(dep: ParsedClassDependency): boolean;
};
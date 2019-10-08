import * as ts from 'typescript';
import { ParsedSourceFile, ParsedClass } from './model';

export function parseSourceFile(file: ts.SourceFile): ParsedSourceFile {
  const result: ParsedSourceFile = {
    imports: [],
    classes: []
  };
  walker(file);
  return result;

  function walker(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ImportDeclaration:
        importsWalker(node as ts.ImportDeclaration);
        break;
      case ts.SyntaxKind.ClassDeclaration:
        classWalker(node as ts.ClassDeclaration);
        break;
      default:
        ts.forEachChild(node, walker);
    }
  }

  function classWalker(node: ts.ClassDeclaration) {
    const klass: ParsedClass = {
      name: node.name && node.name.escapedText as any,
      dependencies: []
    };
    ts.forEachChild(node, (child) => {
      if (child.kind === ts.SyntaxKind.Constructor) {
        const constructor = child as ts.ConstructorDeclaration;
        constructor.parameters.forEach(param => {
          klass.dependencies.push({
            name: param.name.getText(),
            type: param.type && param.type.getText(),
            token: extractInjectionToken(param)
          });
        });
      }
    });
    result.classes.push(klass);
  }

  function extractInjectionToken(param: ts.ParameterDeclaration): string | undefined {
    let token: string | undefined;
    if (param.decorators) {
      param.decorators.forEach(decoratorWalker);
    }
    return token;

    function decoratorWalker(node: ts.Node) {
      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          const callExpression = node as ts.CallExpression;
          if (callExpression.expression.getText() === 'Inject' && callExpression.arguments.length > 0) {
            token = callExpression.arguments[0].getText();
          }
          break;
        default:
          ts.forEachChild(node, decoratorWalker);
      }

    }
  }

  function importsWalker(node: ts.ImportDeclaration) {
    const names: string[] = [];
    if (node.importClause) {
      ts.forEachChild(node.importClause, (child) => {
        ts.forEachChild(child, (element) => {
          names.push(element.getText());
        });
      });
    }
    result.imports.push({
      path: node.moduleSpecifier.getText(),
      names
    });
  }
}

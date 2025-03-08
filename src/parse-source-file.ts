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
      // deps via constructor
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

      // deps from properties
      if (child.kind === ts.SyntaxKind.PropertyDeclaration) {
        const prop = child as ts.PropertyDeclaration;

        prop.forEachChild(propChild => {
          if (propChild.kind === ts.SyntaxKind.CallExpression) {
            const text = propChild.getText();
            if (text.startsWith('inject')) {
              let token: string | undefined;
              let type = prop.type && prop.type.getText();
              if (text.startsWith('inject<')) {
                token = propChild.getChildAt(5)?.getChildAt(0)?.getText().trim();
                if (!type) {
                  type = propChild.getChildAt(2)?.getText();
                }
              } else {
                token = propChild.getChildAt(2)?.getChildAt(0)?.getText().trim();
              }
              // support string tokens
              if (token.startsWith('\'') || token.startsWith('"')) {
                const typeFromToken = !type && token.match(/ProviderToken<(.+)>/);
                if (typeFromToken && typeFromToken[1]) {
                  type = typeFromToken[1];
                }

                // only use the string part for DI
                token = token.substr(0, token.indexOf(token[0], 1) + 1);
              } else if (!type) {
                type = token;
              }

              // special case of injection tokens following upper case convention
              if (!prop.type && type && /^[A-Z]+$/.test(type.replace(/_/g, ''))) {
                type = `typeof ${type} extends ProviderToken<infer T> ? T : unknown`;
                if (!result.imports.find(i => i.names.includes('ProviderToken'))) {
                  result.imports.push({
                    path: '@angular/core',
                    names: ['ProviderToken'],
                  });
                }
              }

              klass.dependencies.push({
                name: prop.name.getText(),
                type,
                token,
              });
            }
          }
        });
      }
    });
    result.classes.push(klass);
  }

  function extractInjectionToken(param: ts.ParameterDeclaration): string | undefined {
    let token: string | undefined;
    // older TS version
    if ((param as any).decorators) {
      (param as any).decorators.forEach(decoratorWalker);
    } else if (param.modifiers) {
      param.modifiers.forEach(decoratorWalker);
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

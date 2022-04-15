
import { DependencyHandler } from '../model';
import defaultDependencyHandler from './default.handler';

export default {
  run(result, dep, options) {
    defaultDependencyHandler.run(result, dep, options);

    // extra subject to support router events if property is used
    if (dep.type === 'Router' && options.sourceCode.includes(`${dep.name}.events`)) {
      result.imports.push({
        path: 'rxjs',
        names: ['ReplaySubject']
      });
      result.imports.push({
        path: '@angular/router',
        names: ['RouterEvent']
      });

      result.declarations.push({
        name: 'routerEventsSubject',
        type: 'ReplaySubject<RouterEvent>'
      });

      result.initializers.push({
        name: 'routerEventsSubject',
        value: 'new ReplaySubject<RouterEvent>(1)'
      });
    }

    if (dep.type === 'ActivatedRoute') {
      const usesParamMap = options.sourceCode.includes(`${dep.name}.paramMap`);
      const usesQueryParamMap = options.sourceCode.includes(`${dep.name}.queryParamMap`);

      // param map mock
      if (usesParamMap || usesQueryParamMap) {
        result.imports.push({
          path: '@angular/router',
          names: ['ParamMap']
        });

        result.imports.push({
          path: 'rxjs',
          names: ['Observable']
        });
      }
      const variants: [apiName: string, varName: string, mapName: string][] = [];
      if (usesParamMap) {
        variants.push(['paramMap', 'routeParams', 'routeParamMap']);
      }
      if (usesQueryParamMap) {
        variants.push(['queryParamMap', 'queryRouteParams', 'routeQueryParamMap']);
      }

      variants.forEach(([apiName, varName, mapName]) => {
        result.declarations.push({
          name: varName,
          type: '{ [prop: string]: string }'
        });

        result.initializers.push({
          name: varName,
          value: '{}'
        });

        result.declarations.push({
          name: `${mapName}`,
          type: 'jasmine.SpyObj<ParamMap>'
        });

        result.initializers.push({
          name: `${mapName}`,
          value: `jasmine.createSpyObj<ParamMap>(${options.quoteSymbol}ParamMap${options.quoteSymbol}, [${options.quoteSymbol}get${options.quoteSymbol}, ${options.quoteSymbol}has${options.quoteSymbol}])`
        });

        result.initializers.push({
          value: `${mapName}.get.and.callFake((k) => ${varName}[k])`
        });

        result.initializers.push({
          value: `${mapName}.has.and.callFake((k) => !!${varName}[k])`
        });

        result.declarations.push({
          name: `${varName}Subject`,
          type: 'ReplaySubject<ParamMap>'
        });

        result.initializers.push({
          // cast below makes sure that typescript is checking asignment
          // this is basically a workaround for readonly properties
          name: `${varName}Subject`,
          value: `(${options.variableName} as { ${apiName}: Observable<ParamMap> }).${apiName} = new ReplaySubject<ParamMap>(1)`
        });
      });

    }
  },

  test(dep) {
    return dep.type === 'Router' || dep.type === 'ActivatedRoute';
  }
} as DependencyHandler;
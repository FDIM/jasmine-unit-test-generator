// in actual implementation replace public api reference with 'jasmine-unit-test-generator'
import { ParsedClassDependency, ClassOptions, DependencyHandler, defaultDependencyHandler, DependencyHandlerOptions } from '../../../src/public-api';

export default {
  run(result: ClassOptions, dep: ParsedClassDependency, options: DependencyHandlerOptions) {

    defaultDependencyHandler.run(result, dep, options);

    const usedEvents = findUsedEvents(dep, options);

    if (usedEvents.length) {
      const eventNames: string[] = [];
      usedEvents.forEach((ev, index) => {
        const name = eventNames[index] = ev.substr(0, 1).toLowerCase() + ev.substr(1).replace(/<.*>/, '') + 'Subject';

        result.declarations.push({
          name,
          type: `ReplaySubject<${ev}>`
        });

        result.initializers.push({
          name,
          value: `new ReplaySubject<${ev}>(1)`
        });

        // find import for this event
        const eventImportPath = options.allImports.find(v => v.names.includes(ev));
        if (eventImportPath) { // should never be false
          result.imports.push({
            names: [ev],
            path: eventImportPath.path
          });
        }

      });

      // these will be deduped
      result.imports.push({
        names: ['ReplaySubject'],
        path: 'rxjs'
      })

      // warning, strange formatting is intentional to create correct output!
      result.initializers.push({
        value:
          `${options.variableName}.of.and.callFake((ev) => {
${usedEvents.map((ev, index) => {
            return `      ${index === 0 ? 'if' : '} else if'} (ev === ${ev}) {
        return ${eventNames[index]};
`;
          }).join('')}      } else {
        throw new Error('event:' + ev + ' not mocked');
      }
    })`
      });
    }
  },

  test(dep: ParsedClassDependency) {
    return dep.type === 'EventBusService';
  }
} as DependencyHandler;

function findUsedEvents(dep: ParsedClassDependency, options: DependencyHandlerOptions): string[] {
  const result: string[] = [];
  const regex = new RegExp(`${dep.name}\.of\\\(([^)]*)\\\)`, 'g');
  let matches: RegExpExecArray | null;

  while (matches = regex.exec(options.sourceCode)) {
    if (result.indexOf(matches[1]) === -1) {
      result.push(decodeURIComponent(matches[1]));
    }
  }
  return result;

}

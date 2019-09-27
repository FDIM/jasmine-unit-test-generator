import { run } from '../lib/cli';
import { unlinkSync, readFileSync } from 'fs';

describe('integration', () => {

  [
    {
      name: 'vehicle',
      file: 'spec/fixtures/vehicle.ts',
      spec: 'spec/fixtures/vehicle.spec.ts',
      expected: 'spec/fixtures/vehicle.spec.expected.ts'
    }
  ].forEach((input) => {

    describe(`${input.name} test`, () => {

      beforeAll(() => {
        run([input.file]);
      });

      afterAll(() => {
        unlinkSync(input.spec);
      });

      it('should create a matching spec file', () => {
        expect(readFileSync(input.spec).toString()).toEqual(readFileSync(input.expected).toString());
      });

    });
  });
});

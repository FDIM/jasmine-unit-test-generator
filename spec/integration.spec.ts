import { run } from '../src/main';
import { unlinkSync, readFileSync } from 'fs';

const leaveSpecFilesOnDisk = false;

describe('integration', () => {

  [
    {
      name: 'login form component',
      file: 'spec/fixtures/components/login-form.component.ts',
      spec: 'spec/fixtures/components/login-form.component.spec.ts',
      expected: 'spec/fixtures/components/login-form.component.spec.expected.ts'
    },
    {
      name: 'login form component',
      file: 'spec/fixtures/auth.service.ts',
      spec: 'spec/fixtures/auth.service.spec.ts',
      expected: 'spec/fixtures/auth.service.spec.expected.ts'
    }
  ].forEach((input) => {

    describe(`${input.name} test`, () => {

      beforeAll(() => {
        run([input.file]);
      });

      if (!leaveSpecFilesOnDisk) {
        afterAll(() => {
          unlinkSync(input.spec);
        });
      }

      it('should create a matching spec file', () => {
        expect(readFileSync(input.spec).toString()).toEqual(readFileSync(input.expected).toString());
      });
    });
  });
});

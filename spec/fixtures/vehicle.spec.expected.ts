import { Vehicle } from './vehicle';
import { Engine } from './engine';

describe('Vehicle', () => {
    let instance: Vehicle;
    let fakeEngine: jasmine.SpyObj<Engine>;

    function createInstance() {
        instance = new Vehicle(
            fakeEngine,
        );
    }

    beforeEach(() => {
        fakeEngine = jasmine.createSpyObj<Engine>('Engine', ['start']);

        createInstance();
    });

    it('should create', () => {
        expect(instance).toBeTruthy();
    });

});

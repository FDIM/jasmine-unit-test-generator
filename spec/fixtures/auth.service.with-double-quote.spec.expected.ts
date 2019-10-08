import { AuthService } from "./auth.service.with-double-quote";
import { LoggerService } from "./helpers/logger.service";
import { EventBusService } from "./helpers/event-bus.service";

describe("AuthService", () => {
  let service: AuthService;
  let fakeWindow: jasmine.SpyObj<Window>;
  let fakeLogger: jasmine.SpyObj<LoggerService>;
  let fakeEventBusService: jasmine.SpyObj<EventBusService>;

  function createService() {
    service = new AuthService(
      fakeWindow,
      fakeLogger,
      fakeEventBusService,
    );
  }

  beforeEach(() => {
    fakeWindow = jasmine.createSpyObj<Window>("Window", ["setInterval"]);
    fakeLogger = jasmine.createSpyObj<LoggerService>("LoggerService", ["debug"]);
    fakeEventBusService = jasmine.createSpyObj<EventBusService>("EventBusService", ["publish"]);

    createService();
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

});

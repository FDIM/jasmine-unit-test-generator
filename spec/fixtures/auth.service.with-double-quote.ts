import { Injectable, Inject } from "@angular/core";
import { LoggerService } from "./helpers/logger.service";
import { EventBusService } from "./helpers/event-bus.service";
import { AuthChangeEvent } from "./helpers/events";

@Injectable()
export class AuthService {

  constructor(
    @Inject("window") protected window: Window,
    private logger: LoggerService,
    private eventBusService: EventBusService
  ) { }

  login(form: { username: string, password: string }) {
    this.logger.debug("[LoginService]", "user logged in");
    this.eventBusService.publish(new AuthChangeEvent("login"));
    this.window.setInterval(() => { }, 0)
  }

  logout() {
    this.logger.debug("[LoginService]", "user logged out");
    this.eventBusService.publish(new AuthChangeEvent("logout"));
  }
}

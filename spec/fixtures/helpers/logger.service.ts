import { Injectable, Inject } from '@angular/core';

@Injectable()
export class LoggerService {

  constructor(
    @Inject('window') protected window: Window,
  ) { }

  // public api
  log = this.getLog('log');
  info = this.getLog('info');
  warn = this.getLog('warn');
  error = this.getLog('error');
  debug = this.getLog('debug');

  protected getLog(type: string): ((message: any, ..._args: any[]) => void) {
    return this.window.console[type] || (() => { });
  }
}

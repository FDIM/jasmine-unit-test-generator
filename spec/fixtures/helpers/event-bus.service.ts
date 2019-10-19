import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class EventBusService {

  publish<T extends Object>(event: T | string, options?: {}): void { }

  of<T>(channel: (new (...args: any[]) => T) | string, priority: boolean = false): Observable<T> {
    return new Observable();
   }
}

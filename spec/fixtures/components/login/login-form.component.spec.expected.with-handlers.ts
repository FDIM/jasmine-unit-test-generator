import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../auth.service';
import { EventBusService } from '../../helpers/event-bus.service';
import { LoginEvent, LogoutEvent } from '../../helpers/events';
import { ReplaySubject } from 'rxjs';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let fakeAuthService: jasmine.SpyObj<AuthService>;
  let fakeEventBusService: jasmine.SpyObj<EventBusService>;
  let loginEventSubject: ReplaySubject<LoginEvent>;
  let logoutEventSubject: ReplaySubject<LogoutEvent>;
  let fakeDocument: jasmine.SpyObj<Document>;
  let fakeWindow: jasmine.SpyObj<Window>;

  beforeEach(async(() => {
    fakeAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    fakeEventBusService = jasmine.createSpyObj<EventBusService>('EventBusService', ['of']);
    loginEventSubject = new ReplaySubject<LoginEvent>(1);
    logoutEventSubject = new ReplaySubject<LogoutEvent>(1);
    fakeEventBusService.of.and.callFake((ev) => {
      if (ev === LoginEvent) {
        return loginEventSubject;
      } else if (ev === LogoutEvent) {
        return logoutEventSubject;
      } else {
        throw new Error('event:' + ev + ' not mocked');
      }
    });
    fakeDocument = jasmine.createSpyObj<Document>('Document', ['querySelectorAll']);
    fakeWindow = jasmine.createSpyObj<Window>('Window', ['alert']);

    TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      providers: [
        { provide: AuthService, useFactory: () => fakeAuthService },
        { provide: EventBusService, useFactory: () => fakeEventBusService },
        { provide: DOCUMENT, useFactory: () => fakeDocument },
        { provide: 'window', useFactory: () => fakeWindow },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

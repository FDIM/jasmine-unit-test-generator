import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../auth.service';
import { EventBusService } from '../../helpers/event-bus.service';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let fakeAuthService: jasmine.SpyObj<AuthService>;
  let fakeEventBusService: jasmine.SpyObj<EventBusService>;
  let fakeDocument: jasmine.SpyObj<Document>;
  let fakeWindow: jasmine.SpyObj<Window>;

  beforeEach(waitForAsync(() => {
    fakeAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    fakeEventBusService = jasmine.createSpyObj<EventBusService>('EventBusService', ['of']);
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

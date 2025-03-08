import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { ProviderToken } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG_TOKEN, ENV, ENV_TOKEN } from '../../helpers/config';
import { AuthService } from '../../auth.service';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let fakeRouter: jasmine.SpyObj<Router>;
  let fakeRoute: jasmine.SpyObj<ActivatedRoute>;
  let fakeDocument: jasmine.SpyObj<Document>;
  let fakeWindow: jasmine.SpyObj<Window>;
  let fakeConfig: jasmine.SpyObj<typeof CONFIG_TOKEN extends ProviderToken<infer T> ? T : unknown>;
  let fakeEnv: jasmine.SpyObj<ENV>;
  let fakeAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    fakeRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    fakeRoute = {} as jasmine.SpyObj<ActivatedRoute>;
    fakeDocument = {} as jasmine.SpyObj<Document>;
    fakeWindow = {} as jasmine.SpyObj<Window>;
    fakeConfig = {} as jasmine.SpyObj<typeof CONFIG_TOKEN extends ProviderToken<infer T> ? T : unknown>;
    fakeEnv = {} as jasmine.SpyObj<ENV>;
    fakeAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);

    TestBed.configureTestingModule({
      declarations: [HomePageComponent],
      providers: [
        { provide: Router, useFactory: () => fakeRouter },
        { provide: ActivatedRoute, useFactory: () => fakeRoute },
        { provide: 'document', useFactory: () => fakeDocument },
        { provide: 'window', useFactory: () => fakeWindow },
        { provide: CONFIG_TOKEN, useFactory: () => fakeConfig },
        { provide: ENV_TOKEN, useFactory: () => fakeEnv },
        { provide: AuthService, useFactory: () => fakeAuthService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

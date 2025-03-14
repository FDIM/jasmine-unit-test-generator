import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfig, CONFIG_TOKEN } from '../../helpers/config';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let fakeRouter: jasmine.SpyObj<Router>;
  let fakeRoute: jasmine.SpyObj<ActivatedRoute>;
  let fakeWindow: jasmine.SpyObj<Window>;
  let fakeConfig: jasmine.SpyObj<AppConfig>;

  beforeEach(waitForAsync(() => {
    fakeRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    fakeRoute = {} as jasmine.SpyObj<ActivatedRoute>;
    fakeWindow = {} as jasmine.SpyObj<Window>;
    fakeConfig = {} as jasmine.SpyObj<AppConfig>;

    TestBed.configureTestingModule({
      declarations: [HomePageComponent],
      providers: [
        { provide: Router, useFactory: () => fakeRouter },
        { provide: ActivatedRoute, useFactory: () => fakeRoute },
        { provide: 'window', useFactory: () => fakeWindow },
        { provide: CONFIG_TOKEN, useFactory: () => fakeConfig },
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

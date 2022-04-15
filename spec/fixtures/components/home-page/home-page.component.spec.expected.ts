import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { Router, ActivatedRoute } from '@angular/router';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let fakeRouter: jasmine.SpyObj<Router>;
  let fakeRoute: jasmine.SpyObj<ActivatedRoute>;
  let fakeWindow: jasmine.SpyObj<Window>;

  beforeEach(waitForAsync(() => {
    fakeRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    fakeRoute = {} as jasmine.SpyObj<ActivatedRoute>;
    fakeWindow = {} as jasmine.SpyObj<Window>;

    TestBed.configureTestingModule({
      declarations: [HomePageComponent],
      providers: [
        { provide: Router, useFactory: () => fakeRouter },
        { provide: ActivatedRoute, useFactory: () => fakeRoute },
        { provide: 'window', useFactory: () => fakeWindow },
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

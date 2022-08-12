import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { ActivatedRoute, ParamMap, Router, RouterEvent } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let fakeRouter: jasmine.SpyObj<Router>;
  let routerEventsSubject: ReplaySubject<RouterEvent>;
  let fakeRoute: jasmine.SpyObj<ActivatedRoute>;
  let routeParams: { [prop: string]: string };
  let routeParamMap: jasmine.SpyObj<ParamMap>;
  let routeParamsSubject: ReplaySubject<ParamMap>;
  let queryRouteParams: { [prop: string]: string };
  let routeQueryParamMap: jasmine.SpyObj<ParamMap>;
  let queryRouteParamsSubject: ReplaySubject<ParamMap>;
  let fakeWindow: jasmine.SpyObj<Window>;

  beforeEach(waitForAsync(() => {
    fakeRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    routerEventsSubject = new ReplaySubject<RouterEvent>(1);
    fakeRoute = {} as jasmine.SpyObj<ActivatedRoute>;
    routeParams = {};
    routeParamMap = jasmine.createSpyObj<ParamMap>('ParamMap', ['get', 'has']);
    routeParamMap.get.and.callFake((k) => routeParams[k]);
    routeParamMap.has.and.callFake((k) => !!routeParams[k]);
    routeParamsSubject = (fakeRoute as { paramMap: Observable<ParamMap> }).paramMap = new ReplaySubject<ParamMap>(1);
    queryRouteParams = {};
    routeQueryParamMap = jasmine.createSpyObj<ParamMap>('ParamMap', ['get', 'has']);
    routeQueryParamMap.get.and.callFake((k) => queryRouteParams[k]);
    routeQueryParamMap.has.and.callFake((k) => !!queryRouteParams[k]);
    queryRouteParamsSubject = (fakeRoute as { queryParamMap: Observable<ParamMap> }).queryParamMap = new ReplaySubject<ParamMap>(1);
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

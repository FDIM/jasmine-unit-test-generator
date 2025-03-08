import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfig, CONFIG_TOKEN } from '../../helpers/config';

@Component({
  selector: 'app-name',
  template: ``,
  styles: [``]
})
export class HomePageComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject('window') private window: Window,
    @Inject(CONFIG_TOKEN) private config: AppConfig,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('type') && params.get('type') === 'user') {
        this.router
          .navigate(['home', 'user']);
      }
    });
  }
}

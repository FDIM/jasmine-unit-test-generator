import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('type') && params.get('type') === 'user') {
        this.router.navigate(['home', 'user']);
      }
    });
  }
}

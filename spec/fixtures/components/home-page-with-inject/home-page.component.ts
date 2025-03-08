import { Component, inject, OnInit, ProviderToken } from '@angular/core';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG_TOKEN, ENV, ENV_TOKEN } from '../../helpers/config';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-name',
  template: ``,
  styles: [``]
})
export class HomePageComponent implements OnInit {
  protected isEnabled = true;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private document = inject<Document>('document' as any);
  private window = inject('window' as unknown as ProviderToken<Window>);
  private config = inject(CONFIG_TOKEN, { optional: true });
  private env: ENV = inject(ENV_TOKEN);
  private authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(take(1)
    ).subscribe(params => {
      if (params.has('type') && params.get('type') === 'user') {
        this.router
          .navigate(['home', 'user']);
      }
    });
    this.authService.login({ username: 'a', password: 'b' });
  }
}

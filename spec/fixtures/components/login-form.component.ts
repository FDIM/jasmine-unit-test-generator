import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { EventBusService } from '../helpers/event-bus.service';
import { AuthChangeEvent } from '../helpers/events';

@Component({
  selector: 'app-login-form',
  template: ``,
  styles: [``]
})
export class LoginFormComponent implements OnInit {
  form: {
    username: string,
    password: string
  };

  constructor(
    private authService: AuthService,
    private eventBusService: EventBusService,
    @Inject(Document) private document: Document
  ) { }

  ngOnInit(): void { 
    this.eventBusService.of(AuthChangeEvent).subscribe();
    this.document.querySelectorAll('div');
  }

  login() {
    this.authService.login(this.form);
  }
}

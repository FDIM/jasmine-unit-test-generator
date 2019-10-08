export class LoginEvent {
  constructor(public profile: any) { }
}

export class LogoutEvent {
  constructor(public reason: string) { }
}

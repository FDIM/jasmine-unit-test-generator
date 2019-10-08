export class AuthChangeEvent {
  constructor(public type: 'login' | 'logout') { }
}
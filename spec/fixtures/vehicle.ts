import { Engine } from './engine';

export class Vehicle {
  constructor(
    private engine: Engine
  ) { }

  drive() {
    this.engine.start();
  }
}
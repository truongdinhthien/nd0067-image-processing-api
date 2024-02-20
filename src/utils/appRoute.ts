import { Router } from 'express';

class AppRoute {
  protected router: Router;
  constructor() {
    this.router = Router();
  }

  initialize() {
    console.warn(
      `[Warning] The ${this.constructor.name}'s initialize function hasn't implemented`,
    );
    return this.router;
  }

  getInstance() {
    return this.router;
  }
}

export default AppRoute;

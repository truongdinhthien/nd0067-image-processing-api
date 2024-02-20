import HomeHandler from '../handler/home.handler';
import AppRoute from '../utils/appRoute';

class HomeRouter extends AppRoute {
  static homeEndpoint = '/';
  private handler: HomeHandler;

  constructor() {
    super();
    this.handler = new HomeHandler();
  }

  initialize() {
    this.router.route(HomeRouter.homeEndpoint).get(this.handler.welcome);

    return this.router;
  }
}

export default HomeRouter;

import express, { type Express, type RequestHandler } from 'express';
import router from './routes';

export type ApplicationConfigs = {
  port: number;
};

export class Application {
  port: number;
  static instance: Express;

  constructor(config: ApplicationConfigs) {
    this.port = config.port;
    // Creating a singleton instance of an Express application
    if (!Application.instance) {
      const app = express();
      Application.instance = app;
    }
  }

  useMiddlewares(...extraMiddlewares: RequestHandler[]) {
    const app = Application.instance;
    app.use('/api', router);

    if (!extraMiddlewares) return;
    extraMiddlewares.forEach((middleware) => app.use(middleware));
  }

  createServer() {
    const app = Application.instance;
    app.listen(this.port, () => {
      console.log(`server started at localhost:${this.port}`);
    });
  }
}

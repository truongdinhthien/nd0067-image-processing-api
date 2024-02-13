import { Application } from './app';

const bootstrap = () => {
  const port = 3000;
  const app = new Application({ port });
  app.useMiddlewares();
  app.createServer();
};

bootstrap();

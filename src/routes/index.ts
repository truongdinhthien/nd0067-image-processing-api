import fs from 'fs';
import express from 'express';
import AppRoute from '../utils/appRoute';

const loadRoutes = () => {
  const router = express.Router();
  const routes = fs.readdirSync(__dirname);

  routes
    .filter((r) => r.endsWith('.route.ts'))
    .forEach((filePath: string) => {
      {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Route: typeof AppRoute = require(`./${filePath}`).default;
        const route = new Route();
        route.initialize();
        router.use(route.getInstance());
      }
    });
  return router;
};

export default loadRoutes();

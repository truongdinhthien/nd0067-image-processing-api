import supertest from 'supertest';
import { Application } from '../../app';

const app = new Application({ port: 3000 });
app.useMiddlewares();
const request = supertest(Application.instance);

export default request;

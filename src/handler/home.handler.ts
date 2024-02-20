import { Request, Response } from 'express';

class HomeHandler {
  welcome(_: Request, res: Response) {
    res.status(200).send('API route is working!');
  }
}

export default HomeHandler;

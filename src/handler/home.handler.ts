import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import marked from 'marked';

class HomeHandler {
  async welcome(_: Request, res: Response) {
    const file = await fs.readFile(path.resolve('./README.md'));
    res.status(200).send(marked.parse(file.toString()));
  }
}

export default HomeHandler;

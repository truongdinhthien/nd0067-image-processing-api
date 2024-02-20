import { NextFunction, Request, Response } from 'express';
import { checkFileExists } from '../utils/files';
import path from 'path';

export type ImageQuery = {
  filename: string;
  width: number;
  height: number;
};

type GetImageRequest = Request<unknown, unknown, unknown, ImageQuery>;

class ImageHandler {
  public async validateQuery(
    req: GetImageRequest,
    res: Response,
    next: NextFunction,
  ) {
    const { filename, width, height } = req.query;
    // Validate filename
    if (!filename) {
      return res
        .status(400)
        .send(`'filename' should not empty from query parameters`);
    }

    const filePath = path.resolve(`./images/full/${filename}.jpg`);
    const found = await checkFileExists(filePath);
    if (!found) return res.status(400).send(`'filename' is not exist`);

    // Only validate if both width and height have value
    if (width === undefined && height === undefined) {
      return next();
    }

    // Validate width
    if (Number.isNaN(+width) || width < 1) {
      return res
        .status(400)
        .send(`'width' should be a positive number from query parameters`);
    }

    // Validate height
    if (Number.isNaN(+height) || height < 1) {
      return res
        .status(400)
        .send(`'height' should be a positive number from query parameters`);
    }

    // Validate success
    return next();
  }
  public async getImageThumb(req: GetImageRequest, res: Response) {
    const { filename, width, height } = req.query;
    if (!width && !height) {
      const filePath = path.resolve(`./images/full/${filename}.jpg`);
      return res.status(200).sendFile(filePath);
    }
    res.status(200).send('TODO');
  }
}

export default ImageHandler;

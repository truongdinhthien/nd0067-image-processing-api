import { NextFunction, Request, Response } from 'express';
import { checkFileExists, createFile } from '../utils/files';
import path from 'path';
import { resizeImage } from '../utils/imageFormat';

export type ImageQuery = {
  filename: string;
  width: number;
  height: number;
};

type GetImageRequest = Request<unknown, unknown, unknown, ImageQuery>;

class ImageHandler {
  static getFullImagePath = (filename: string) => {
    return path.resolve(`./images/full/${filename}.jpg`);
  };

  static getThumbImagePath = ({ filename, width, height }: ImageQuery) => {
    return path.resolve(`./images/thumb/${filename}_${width}x${height}.jpg`);
  };

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

    const filePath = ImageHandler.getFullImagePath(filename);
    const isExist = await checkFileExists(filePath);
    if (!isExist) return res.status(404).send(`'filename' is not exist`);

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

    // Validate success and format number
    req.query.width = +width;
    req.query.height = +height;
    return next();
  }
  public async getImageThumb(req: GetImageRequest, res: Response) {
    try {
      const { filename, width, height } = req.query;
      const filePath = ImageHandler.getFullImagePath(filename);
      // Return the original image if not resizing
      if (!width && !height) {
        return res.status(200).sendFile(filePath);
      }

      const thumbFilePath = ImageHandler.getThumbImagePath(req.query);
      // Return the exist image instead of processing it
      const isExist = await checkFileExists(thumbFilePath);
      if (isExist) return res.status(200).sendFile(thumbFilePath);

      const resizedImage = await resizeImage(filePath, {
        width: +width,
        height: +height,
      });

      await createFile(thumbFilePath, resizedImage);
      res.status(200).sendFile(thumbFilePath);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default ImageHandler;

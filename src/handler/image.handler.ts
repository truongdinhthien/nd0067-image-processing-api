import { NextFunction, Request, Response } from 'express';
import { checkFileExists, createFile } from '../utils/files';
import path from 'path';
import { resizeImage } from '../utils/imageFormat';

export type ImageOptions = {
  filename: string;
  width: number;
  height: number;
};

export type ImageValidator = {
  value: ImageOptions;
  error: string | null;
};

export type ImageFileData = {
  path: string;
  isExist: boolean;
};

type GetImageRequest = Request<unknown, unknown, unknown, ImageOptions>;

class ImageHandler {
  static getFullImage = async (filename: string): Promise<ImageFileData> => {
    const filePath = path.resolve(`./images/full/${filename}.jpg`);
    const response: ImageFileData = {
      path: filePath,
      isExist: true,
    };
    response.isExist = await checkFileExists(filePath);
    return response;
  };

  static getThumbImage = async ({
    filename,
    width,
    height,
  }: ImageOptions): Promise<ImageFileData> => {
    const filePath = path.resolve(
      `./images/thumb/${filename}_${width}x${height}.jpg`,
    );
    const response: ImageFileData = {
      path: filePath,
      isExist: true,
    };
    response.isExist = await checkFileExists(filePath);
    return response;
  };

  static parseOptions = (options: ImageOptions): ImageOptions => {
    return {
      filename: options.filename,
      width: +options.width,
      height: +options.height,
    };
  };

  static validateImageOptions = (options: ImageOptions): ImageValidator => {
    const { filename, width, height } = options;
    const response: ImageValidator = {
      value: ImageHandler.parseOptions(options),
      error: null,
    };

    if (!filename) {
      response.error = `'filename' should not empty from query parameters`;
      return response;
    }

    if (width === undefined && height === undefined) return response;

    if (Number.isNaN(+width) || width < 1) {
      response.error = `'width' should be a positive number from query parameters`;
      return response;
    }

    if (Number.isNaN(+height) || height < 1) {
      response.error = `'height' should be a positive number from query parameters`;
      return response;
    }

    return response;
  };

  static processCreateThumbnail = async (
    options: ImageOptions,
  ): Promise<string> => {
    const { filename, width, height } = options;
    const fullImage = await ImageHandler.getFullImage(filename);
    if (fullImage.isExist && !width && !height) return fullImage.path;

    const thumbImage = await ImageHandler.getThumbImage(options);
    if (thumbImage.isExist) return thumbImage.path;

    const resizedImage = await resizeImage(fullImage.path, {
      width: options.width,
      height: options.height,
    });

    await createFile(thumbImage.path, resizedImage);
    return thumbImage.path;
  };

  public async validateQueryRequest(
    req: GetImageRequest,
    res: Response,
    next: NextFunction,
  ) {
    const { filename } = req.query;
    const validator = ImageHandler.validateImageOptions(req.query);
    if (validator.error) return res.status(400).send(validator.error);

    const image = await ImageHandler.getFullImage(filename);
    if (!image.isExist) return res.status(404).send(`'filename' is not exist`);

    req.query = validator.value;
    return next();
  }

  public async createThumbnailRequest(req: GetImageRequest, res: Response) {
    try {
      const thumbnail = await ImageHandler.processCreateThumbnail(req.query);
      res.status(200).sendFile(thumbnail);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default ImageHandler;

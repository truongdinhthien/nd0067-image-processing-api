import sharp from 'sharp';
import ImageHandler, { ImageOptions } from '../handler/image.handler';
import request from './helpers/mock-request';
import { checkFileExists } from '../utils/files';

describe('Test image processing function', () => {
  describe('validateImageOptions', () => {
    it('should return the error when filename is not provided', async () => {
      const options = {};
      const validator = ImageHandler.validateImageOptions(options as never);

      expect(validator.error).not.toBeNull();
    });

    it('should return the error when width is negative', async () => {
      const options = {
        filename: 'filename',
        width: -200,
        height: 100,
      };
      const validator = ImageHandler.validateImageOptions(options);

      expect(validator.error).not.toBeNull();
    });

    it('should return the error when height is negative', async () => {
      const options = {
        filename: 'filename',
        width: 200,
        height: -100,
      };
      const validator = ImageHandler.validateImageOptions(options);

      expect(validator.error).not.toBeNull();
    });

    it('should return the parse with valid options', async () => {
      const options = {
        filename: 'filename',
        width: '200',
        height: 100,
      };
      const validator = ImageHandler.validateImageOptions(options as never);

      expect(validator.error).toBeNull();

      expect(validator.value.width).toBeGreaterThan(0);
      expect(validator.value.height).toBeGreaterThan(0);
    });
  });

  describe('processCreateThumbnail', () => {
    it('should generate the resized thumbnail', async () => {
      const options = {
        filename: 'fjord',
        width: 50,
        height: 100,
      };
      const createdThumb = await ImageHandler.processCreateThumbnail(options);
      const foundThumbImage = await ImageHandler.getThumbImage(options);

      expect(createdThumb).toEqual(foundThumbImage.path);
    });

    it('should throws an error with the invalid options', async () => {
      let isError = false;
      try {
        const options = {
          filename: 'fjord',
          width: -500,
          height: 100,
        };
        await ImageHandler.processCreateThumbnail(options);
      } catch (_) {
        isError = true;
      }

      expect(isError).toBe(true);
    });
  });
});

describe('Test image processing API', () => {
  describe('GET /api/images', () => {
    it('should return 400 without parameters', async () => {
      const response = await request.get('/api/images');
      expect(response.status).toBe(400);
    });

    it('should return 404 with invalid filename', async () => {
      const filename = 'error';
      const response = await request.get(`/api/images?filename=${filename}`);
      expect(response.status).toBe(404);
    });

    it('should return 400 with negative dimension', async () => {
      const filename = 'fjord';
      const width = -100;
      const height = -50;
      const response = await request.get(
        `/api/images?filename=${filename}&width=${width}&height=${height}`,
      );
      expect(response.status).toBe(400);
    });

    it('should return original image with valid filename and without dimension', async () => {
      const filename = 'fjord';
      const response = await request.get(`/api/images?filename=${filename}`);

      expect(response.status).toBe(200);
      expect(response.type).toBe('image/jpeg');

      const image = await ImageHandler.getFullImage(filename);
      expect(image.isExist).toBe(true);
    });

    it('should return resized image with valid dimension', async () => {
      const filename = 'fjord';
      const width = 200;
      const height = 100;
      const response = await request.get(
        `/api/images?filename=${filename}&width=${width}&height=${height}`,
      );

      expect(response.status).toBe(200);
      expect(response.type).toBe('image/jpeg');

      const thumbnail = await ImageHandler.getThumbImage({
        filename,
        width,
        height,
      });
      expect(thumbnail.isExist).toBe(true);

      const metadata = await sharp(thumbnail.path).metadata();
      expect(metadata.width).toEqual(width);
      expect(metadata.height).toEqual(height);
    });
  });
});

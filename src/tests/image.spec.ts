import sharp from 'sharp';
import ImageHandler from '../handler/image.handler';
import { checkFileExists } from '../utils/files';
import request from './helpers/mock-request';

describe('Test image endpoint responses', () => {
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
    const file = ImageHandler.getFullImagePath(filename);
    const isExist = await checkFileExists(file);
    expect(isExist).toBe(true);
  });

  it('should return resized image with valid dimensions and write them in `thumb` folder', async () => {
    const filename = 'fjord';
    const width = 200;
    const height = 100;
    const response = await request.get(
      `/api/images?filename=${filename}&width=${width}&height=${height}`,
    );
    expect(response.status).toBe(200);
    const file = ImageHandler.getThumbImagePath({
      filename,
      width,
      height,
    });
    const isExist = await checkFileExists(file);
    expect(isExist).toBe(true);

    const metadata = await sharp(file).metadata();
    expect(metadata.width).toEqual(width);
    expect(metadata.height).toEqual(height);
  });
});

import sharp from 'sharp';

export type FormatImageOptions = sharp.ResizeOptions;

export const resizeImage = async (
  target: string,
  { width, height }: FormatImageOptions,
) => {
  const bufferFile = await sharp(target).resize({ width, height }).toBuffer();
  return bufferFile;
};

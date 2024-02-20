import sharp from 'sharp';

export type FormatImageOptions = sharp.ResizeOptions;

export const resizeImage = async (
  target: string,
  { width, height }: FormatImageOptions,
) => {
  const bufferFile = await sharp(target)
    .resize({
      width,
      height,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toBuffer();
  return bufferFile;
};

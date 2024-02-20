import fsPromises from 'fs/promises';
import path from 'path';

export const checkFileExists = async (filePath: string) => {
  try {
    await fsPromises.access(filePath, fsPromises.constants.F_OK);
    return true;
  } catch (err) {
    const knownError = err as NodeJS.ErrnoException;
    if (knownError.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
};

export const createFile = async (
  filePath: string,
  content: string | Buffer,
): Promise<void> => {
  await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
  await fsPromises.writeFile(filePath, content);
};

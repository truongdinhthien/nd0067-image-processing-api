import fs from 'fs/promises';

export const checkFileExists = async (filePath: string) => {
  try {
    console.log(filePath);
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    const knownError = err as NodeJS.ErrnoException;
    if (knownError.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
};

import multer from 'multer';
import path from 'path';
import config from './config';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const destDir = path.join(config.publicPath, 'images');
    await fs.mkdir(destDir, { recursive: true });
    callback(null, config.publicPath);
  },
  filename(_req, _file, callback) {
    callback(null, 'images/' + randomUUID() + '.jpg');
  },
});

export const imagesUpload = multer({ storage: imageStorage });

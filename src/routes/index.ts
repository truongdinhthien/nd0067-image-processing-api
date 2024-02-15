import express from 'express';
import imageHandler from '../handler/image.handler';

const router = express.Router();

router.route('/').get((_, res) => {
  res.status(200).send('API route is working!');
});

router.route('/images').get(imageHandler.validateQuery, (_, res) => {
  res.status(200).send('Images route is working!');
});

export default router;

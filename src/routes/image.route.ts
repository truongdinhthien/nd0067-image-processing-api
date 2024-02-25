import ImageHandler from '../handler/image.handler';
import AppRoute from '../utils/appRoute';

class ImageRouter extends AppRoute {
  static getImageRoutePath = '/images';
  private handler: ImageHandler;

  constructor() {
    super();
    this.handler = new ImageHandler();
  }

  initialize() {
    this.router
      .route(ImageRouter.getImageRoutePath)
      .get(
        this.handler.validateQueryRequest,
        this.handler.createThumbnailRequest,
      );

    return this.router;
  }
}

export default ImageRouter;

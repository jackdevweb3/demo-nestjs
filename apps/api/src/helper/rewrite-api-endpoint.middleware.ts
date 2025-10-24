import { Injectable, NestMiddleware } from '@nestjs/common';

//to fix bull board url, a little ugly
@Injectable()
export class RewriteApiEndpointMiddleware implements NestMiddleware {
  use(req, res, next: () => void) {
    if (req.url.indexOf('/admin/api') != -1 || req.url.indexOf('/admin/queues') != -1) {
      req.url = req.url
        .replace(/^\/admin\/api\/admin\/queues\/api\/admin\/queues/, '/admin/api/admin/queues')
        .replace(/^\/admin\/queues\/queue\/api\/admin\/queues\/api\/admin\/queues/, '/admin/queues')
        .replace(/^\/admin\/queues\/queue\/api\/admin\/queues/, '/admin/queues')
        .replace(/^\/admin\/api\/admin/, '/admin');
    }

    next();
  }
}

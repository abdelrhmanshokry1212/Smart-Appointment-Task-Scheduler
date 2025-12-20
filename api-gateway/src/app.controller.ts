
import { Controller, All, Req, Res, HttpStatus, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) { }

  private services = {
    users: 'http://localhost:3001',
    appointments: 'http://localhost:3002',
    notifications: 'http://localhost:3003',
    logs: 'http://localhost:3004',
    analytics: 'http://localhost:3005',
    storage: 'http://localhost:3006',
  };

  @All(':service')
  async proxyRoot(@Req() req: Request, @Res() res: Response, @Param('service') serviceName: string) {
    console.log(`[Gateway] Root Proxy: ${req.method} ${req.url} -> Service: ${serviceName}`);
    await this.handleProxy(req, res, serviceName);
  }

  @All(':service/*')
  async proxyDeep(@Req() req: Request, @Res() res: Response, @Param('service') serviceName: string) {
    console.log(`[Gateway] Deep Proxy: ${req.method} ${req.url} -> Service: ${serviceName}`);
    await this.handleProxy(req, res, serviceName);
  }

  private async handleProxy(req: Request, res: Response, serviceName: string) {
    const serviceUrl = this.services[serviceName];
    if (!serviceUrl) {
      console.warn(`[Gateway] Service not found for: ${serviceName}`);
      return res.status(HttpStatus.NOT_FOUND).json({ message: `Service '${serviceName}' not found` });
    }

    const url = `${serviceUrl}${req.url}`;
    console.log(`[Gateway] Forwarding to: ${url}`);

    try {
      const config: any = {
        method: req.method,
        url: url,
        headers: { ...req.headers },
        params: req.query,
        responseType: 'stream' // Important for file downloads
      };

      // Remove host header to avoid conflicts
      delete config.headers.host;
      delete config.headers['content-length']; // Let axios/adapter handle this

      if (req.is('multipart/form-data')) {
        // for multipart, we must stream the request
        // But HttpService/Axios is tricky with streaming uploads from incoming req
        // Easier approach: Use a dedicated proxy middleware or manually pipe.
        // Let's manually pipe using axios 'data' as stream.
        config.data = req;
      } else {
        config.data = req.body;
      }

      const response = await firstValueFrom(this.httpService.request(config));

      // Pipe response back to client
      response.data.pipe(res);
    } catch (error) {
      console.error(`[Gateway] Error forwarding to ${url}:`, error.message);
      if (error.response) {
        res.status(error.response.status);
        error.response.data.pipe(res);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Service unavailable' });
      }
    }
  }
}

import { Controller, Get, Post, Param, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express';
import * as fs from 'fs';

@Controller('storage')
export class AppController {
  constructor(private readonly appService: AppService) {
    // Ensure uploads directory exists
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      originalname: file.originalname,
      url: `/storage/${file.filename}`
    };
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const path = join(process.cwd(), 'uploads', filename);
    if (fs.existsSync(path)) {
      return res.sendFile(path);
    }
    return res.status(404).json({ message: 'File not found' });
  }
}

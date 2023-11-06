import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  getHtml(@Res() res: Response): void {
    const htmlPath = path.join(__dirname, './public/index.html'); // Đường dẫn đến tệp HTML
    const htmlContent = fs.readFileSync(htmlPath, 'utf8'); // Đọc nội dung của tệp HTML
    res.status(200).send(htmlContent); // Gửi nội dung HTML về trình duyệt
  }
}

import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/roles.decorator';
import { Role } from '@prisma/client';
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

  @Get('ticket-booking.html')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  bookTicket() {
    // Controller sẽ chỉ được gọi nếu guard trả về true
    return 'Booking ticket';
  }

  @Get('test.html')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  test() {
    // Controller sẽ chỉ được gọi nếu guard trả về true
    return 'Booking ticket';
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  // @Post('signin')
  // signin(@Request() req, @Response() res, @Body() dto: CreateAuthDto) {
  //   return this.authService.signin(dto, req, res);
  // }

  // @Get('signout')
  // signout(@Request() req, @Response() res) {
  //   return this.authService.signout(req, res);
  // }
}

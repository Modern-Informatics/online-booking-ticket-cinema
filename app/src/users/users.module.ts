import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/auth/password.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, PasswordService],
})
export class UsersModule {}

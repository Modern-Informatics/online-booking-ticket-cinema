import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './UserController';
import { PasswordService } from 'src/auth/password.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PasswordService],
})
export class UserModule {}

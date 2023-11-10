import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { PasswordService } from './password.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password, role } = createUserDto;
    // const password_hash = this.passwordService.hashPassword(password);
    const password_hash = await this.passwordService.hashPassword(password);
    return this.userService.create({
      email,
      name,
      password_hash,
      role,
    });
  }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async signin(dto: CreateAuthDto, req: Request, res: Response) {
  //   throw new NotImplementedException();
  // }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async signout(req: Request, res: Response) {
  //   throw new NotImplementedException();
  // }
}

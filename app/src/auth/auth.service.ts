import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private passwordService: PasswordService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const user = await this.usersService.create({
      email: registerDto.email,
      name: registerDto.name,
      password_hash: await this.passwordService.hash(registerDto.password),
      role: registerDto.role,
    });

    return {
      token: this.jwtService.sign({
        email: user.email,
        role: user.role,
      }),
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('user not found!');
    }

    const validatePassword = await this.passwordService.compare(
      password,
      user.password_hash,
    );

    if (!validatePassword) {
      throw new NotFoundException('Invalid password');
    }

    return {
      token: this.jwtService.sign({
        email: user.email,
        role: user.role,
      }),
    };
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PasswordService } from 'src/auth/password.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private passwordService: PasswordService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.user({ user_id: Number(id) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('users/name')
  async findByName(@Query('name') name: string): Promise<User[]> {
    return this.usersService.users({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }

  @Get('user/email/:email')
  async findByEmail(@Param('email') email: string) : Promise<User | null> {
    return this.usersService.user({
      email: email,
    })
  }

  @Patch('user/:id')
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
      const { email, name, password, role } = updateUserDto;

      return this.usersService.update({
        where: { user_id: Number(id) },
        data: {
          email,
          name,
          password_hash: await this.passwordService.hash(password),
          role,
        },
      });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete({ user_id: Number(id) });
  }
}

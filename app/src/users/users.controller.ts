import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.user({ user_id: Number(id) });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete({ user_id: Number(id) });
  }
}

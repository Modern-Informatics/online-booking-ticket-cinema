import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return await this.userService.user({ user_id: Number(id) });
  }

  @Patch('user/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update({
      where: { user_id: Number(id) },
      data: updateUserDto,
    });
  }

  @Delete('user/:id')
  async delete(@Param('id') id: string): Promise<User | null> {
    return await this.userService.delete({ user_id: Number(id) });
  }
}

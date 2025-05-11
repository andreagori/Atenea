import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Logger } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  // CREATE USER
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiResponse({ status: 200, description: 'User found', type: User })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiResponse({ status: 200, description: 'User found', type: User })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @Get('username/:username')
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

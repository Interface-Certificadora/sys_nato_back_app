import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorUserEntity } from '../entities/erro.user.entity';
import { User } from '../entities/user.entity';

@Controller('user')
export class UserControllerPublic {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Cadastra um novo usuário',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorUserEntity,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorUserEntity } from './entities/erro.user.entity';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
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

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Listagem de usuários',
    type: [User],
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum usuário encontrado',
    type: ErrorUserEntity,
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'dados do Usuário',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: ErrorUserEntity,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: ErrorUserEntity,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'Usuário removido',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: ErrorUserEntity,
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

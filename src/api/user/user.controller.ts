import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ErrorUserEntity } from './entities/erro.user.entity';
import { User } from './entities/user.entity';
import { LoginGuard } from '../login/login.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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

import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { UserLogin } from './dto/user.login.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Login } from './entities/login.entity';
import { ErrorLoginEntity } from './entities/erro.login.entity';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @ApiResponse({
    status: 200,
    type: Login,
  })
  @ApiResponse({
    status: 404,
    type: ErrorLoginEntity,
  })
  create(@Body() data: UserLogin) {
    return this.loginService.login(data);
  }
}

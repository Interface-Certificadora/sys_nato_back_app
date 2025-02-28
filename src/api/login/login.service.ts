import { HttpException, Injectable } from '@nestjs/common';
import { UserLogin } from './dto/user.login.dto';
import { Login } from './entities/login.entity';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorLoginEntity } from './entities/erro.login.entity';

@Injectable()
export class LoginService {
  constructor(
    private prismasService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(dados: UserLogin): Promise<Login | ErrorLoginEntity> {
    try {
      const UsuarioExist = await this.GetUser(dados.email);

      if (!UsuarioExist) {
        const retorno: ErrorLoginEntity = {
          message: 'Usuário e senha incorretos',
        };
        throw new HttpException(retorno, 400);
      }

      const isValid = bcrypt.compareSync(dados.password, UsuarioExist.password);

      if (!isValid) {
        const retorno: ErrorLoginEntity = {
          message: 'Usuário e senha incorretos',
        };
        throw new HttpException(retorno, 400);
      }

      const Payload = {
        id: UsuarioExist.id,
        nome: UsuarioExist.nome,
        email: UsuarioExist.email,
      };

      const data: Login = {
        user: {
          id: UsuarioExist.id,
          nome: UsuarioExist.nome,
          email: UsuarioExist.email,
        },
        token: this.jwtService.sign(Payload),
      };
      return data;
    } catch (error) {
      const retorno: ErrorLoginEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async GetUser(email: string) {
    try {
      const UsuarioExist = await this.prismasService.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!UsuarioExist) {
        return null;
      }
      return UsuarioExist;
    } catch {
      return null;
    }
  }
}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserControllerPublic } from './public/user.controller';

@Module({
  controllers: [UserController, UserControllerPublic],
  providers: [UserService, PrismaService],
})
export class UserModule {}

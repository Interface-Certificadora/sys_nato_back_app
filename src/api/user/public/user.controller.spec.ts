import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserControllerPublic } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UserController', () => {
  let controller: UserControllerPublic;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaService,
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [UserControllerPublic],
      providers: [UserService],
    }).compile();

    controller = module.get<UserControllerPublic>(UserControllerPublic);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

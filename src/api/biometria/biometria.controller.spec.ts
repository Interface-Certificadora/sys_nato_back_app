import { Test, TestingModule } from '@nestjs/testing';
import { BiometriaController } from './biometria.controller';
import { BiometriaService } from './biometria.service';

describe('BiometriaController', () => {
  let controller: BiometriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiometriaController],
      providers: [BiometriaService],
    }).compile();

    controller = module.get<BiometriaController>(BiometriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

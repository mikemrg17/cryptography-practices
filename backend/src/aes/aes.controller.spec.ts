import { Test, TestingModule } from '@nestjs/testing';
import { AesController } from './aes.controller';
import { AesService } from './aes.service';

describe('AesController', () => {
  let controller: AesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AesController],
      providers: [AesService],
    }).compile();

    controller = module.get<AesController>(AesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

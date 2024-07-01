import { Test, TestingModule } from '@nestjs/testing';
import { DhController } from './dh.controller';
import { DhService } from './dh.service';

describe('DhController', () => {
  let controller: DhController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DhController],
      providers: [DhService],
    }).compile();

    controller = module.get<DhController>(DhController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

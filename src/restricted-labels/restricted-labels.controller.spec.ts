import { Test, TestingModule } from '@nestjs/testing';
import { RestrictedLabelsController } from './restricted-labels.controller';
import { RestrictedLabelsService } from './restricted-labels.service';

describe('RestrictedLabelsController', () => {
  let controller: RestrictedLabelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestrictedLabelsController],
      providers: [RestrictedLabelsService],
    }).compile();

    controller = module.get<RestrictedLabelsController>(RestrictedLabelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

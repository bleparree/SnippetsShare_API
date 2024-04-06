import { Test, TestingModule } from '@nestjs/testing';
import { RestrictedLabelsService } from './restricted-labels.service';

describe('RestrictedLabelsService', () => {
  let service: RestrictedLabelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestrictedLabelsService],
    }).compile();

    service = module.get<RestrictedLabelsService>(RestrictedLabelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from './resources.service';

describe('ResourcesService', () => {
  let service: ResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourcesService],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRestrictedLabelTypes', () => {
    it('Test to get Label Types',async () => {
      const res = service.getRestrictedLabelTypes();
      expect(res).toBeDefined();
      expect(res.length).toBeGreaterThanOrEqual(1);
    });
  });
});

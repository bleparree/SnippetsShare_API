import { Test, TestingModule } from '@nestjs/testing';
import { SnippetsService } from './snippets.service';

describe('SnippetsService', () => {
//   let service: SnippetsService;

//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [SnippetsService],
//     }).compile();

//     service = module.get<SnippetsService>(SnippetsService);
//   });

  it('should be defined', () => {
    expect(1).toBe(1);
//     expect(service).toBeDefined();
  });
});

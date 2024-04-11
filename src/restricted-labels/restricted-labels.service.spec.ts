import { Test, TestingModule } from '@nestjs/testing';
import { RestrictedLabelsService } from './restricted-labels.service';
import { MongodbModule } from '../mongodb.module';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { Collection, Db, FindCursor } from 'mongodb';

describe('RestrictedLabelsService', () => {
  let service: RestrictedLabelsService;
  let collectionMock: Partial<Collection>;
  jest.mock('mongodb');

  beforeEach(async () => {
    const cursorMock: Partial<FindCursor> = { toArray: jest.fn() };
    collectionMock = { find: jest.fn().mockReturnValue(cursorMock) };
    const dbMock: Partial<Db> = { collection: jest.fn().mockReturnValue(collectionMock) };

    const module: TestingModule = await Test.createTestingModule({
      imports: [MongodbModule],
      providers: [
        RestrictedLabelsService,
        { provide: 'MONGO_CLIENT', useValue: dbMock },
      ],
    }).compile();

    service = module.get<RestrictedLabelsService>(RestrictedLabelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test', () => {
    it('test mock mongo', () => {
      const result = [{ _id: 'zejilfhze', name:'toto', type: 'Code' }];
      (collectionMock.find as jest.Mock).mockReturnValue({ toArray: jest.fn().mockResolvedValue(result) });

      service.getRestrictedLabels().then((res:RestrictedLabel[]) => {
        console.log(res);
      })
    })
  })
});

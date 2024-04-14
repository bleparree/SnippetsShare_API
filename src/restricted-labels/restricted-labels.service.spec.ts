import { Test, TestingModule } from '@nestjs/testing';
import { RestrictedLabelsService } from './restricted-labels.service';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('RestrictedLabelsService', () => {
  let service: RestrictedLabelsService;
  let mongod:MongoMemoryServer;
  let client:MongoClient;
  let db:Db;
  const restrictedLabelFullList = [
    { _id: new ObjectId(), name:'Test1', type: 'Code' },
    { _id: new ObjectId(), name:'Test2', type: 'Repository' },
    { _id: new ObjectId(), name:'Test3', type: 'FreeLabel' },
    { _id: new ObjectId(), name:'Test4', type: 'Code' },
    { _id: new ObjectId(), name:'MyTest1', type: 'FreeLabel' },
    { _id: new ObjectId(), name:'MyTest2', type: 'Repository' },
    { _id: new ObjectId(), name:'MyTest3', type: 'Code' },
  ];

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create({ instance: { dbName: 'SnippetsShare'}});
    client = new MongoClient(mongod.getUri());
    db = client.db('SnippetsShare');

    await db.collection('RestrictedLabel').insertMany(restrictedLabelFullList);
  });

  afterAll(async () => {
    client.close();
    mongod.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestrictedLabelsService,
        { provide: 'MONGO_CLIENT', useValue: db },
      ],
    }).compile();

    service = module.get<RestrictedLabelsService>(RestrictedLabelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRestrictedLabels', () => {

    it('Test to get the full list', async () => {
      await service.getRestrictedLabels().then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual(restrictedLabelFullList.map(val => new RestrictedLabel(val)));
      })
    });
    it('Test to filter by name', async () => {
      const filterName = 'MyT';
      await service.getRestrictedLabels(filterName).then((res:RestrictedLabel[]) => {
        // expect(res).toStrictEqual(restrictedLabelFullList.map(val => new RestrictedLabel(val)).find((lb) => lb.name.indexOf(filterName)));
      })
    });
    it('Test to filter by name with upper case', async () => {});
    it('Test to filter by type', async () => {});
    it('Test to filter name and type', async () => {});
    it('Test to filter by something which does not exist', async () => {});
  });

  describe('addRestrictedLabel', () => {
    it('Test to add a new label',async () => {});
  });

  describe('updateRestrictedLabel', () => {
    it('Test to update an existing label',async () => {});
    it('Test to update with an unknown id',async () => {});
  });

  describe('deleteRestrictedLabel', () => {
    it('Test to delete an existing label',async () => {});
    it('Test to delete with an unknown id',async () => {});
  });

  describe('getRestrictedLabelTypes', () => {
    it('Test to get Label Types',async () => {});
  });

  describe('Without MongoDb Connection', () => {
    it('getRestrictedLabels return 500',async () => {});
    it('addRestrictedLabel return 500',async () => {});
    it('updateRestrictedLabel return 500',async () => {});
    it('deleteRestrictedLabel return 500',async () => {});
  });
});

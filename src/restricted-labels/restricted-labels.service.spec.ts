import { Test, TestingModule } from '@nestjs/testing';
import { RestrictedLabelsService } from './restricted-labels.service';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { addRestrictedLabel } from './dto/addRestrictedLabel.dto';
import { updateRestrictedLabel } from './dto/updateRestrictedLabel.dto';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

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
  let mockConnectionOff;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create({ instance: { dbName: 'SnippetsShare'}});
    client = new MongoClient(mongod.getUri());
    db = client.db('SnippetsShare');

    await db.collection('RestrictedLabel').insertMany(restrictedLabelFullList);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestrictedLabelsService,
        { provide: 'MONGO_CLIENT', useValue: db },
      ],
    }).compile();

    service = module.get<RestrictedLabelsService>(RestrictedLabelsService);
  });

  afterAll(async () => {
    client.close();
    mongod.stop();
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
        expect(res).toStrictEqual(
          restrictedLabelFullList.map(val => new RestrictedLabel(val)).filter((lb) => lb.name.toLowerCase().indexOf(filterName.toLowerCase()) != -1)
        );
      })
    });
    it('Test to filter by name with upper case', async () => {
      const filterName = 'myt';
      await service.getRestrictedLabels(filterName).then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual(
          restrictedLabelFullList.map(val => new RestrictedLabel(val)).filter((lb) => lb.name.toLowerCase().indexOf(filterName.toLowerCase()) != -1)
        );
      })
    });
    it('Test to filter by type', async () => {
      const filterType = 'Code';
      await service.getRestrictedLabels(null, filterType).then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual(
          restrictedLabelFullList.map(val => new RestrictedLabel(val)).filter((lb) => lb.type.toLowerCase().indexOf(filterType.toLowerCase()) != -1)
        );
      })
    });
    it('Test to filter name and type', async () => {
      const filterName = 'myt';
      const filterType = 'Code';
      await service.getRestrictedLabels(filterName, filterType).then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual(
          restrictedLabelFullList.map(val => new RestrictedLabel(val))
            .filter((lb) => lb.type.toLowerCase().indexOf(filterType.toLowerCase()) != -1)
            .filter((lb) => lb.name.toLowerCase().indexOf(filterName.toLowerCase()) != -1)
        );
      })
    });
    it('Test to filter by something which does not exist', async () => {
      const filterName = 'Do not exist';
      await service.getRestrictedLabels(filterName).then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual([]);
      })
    });
  });

  describe('addRestrictedLabel', () => {
    it('Test to add a new label',async () => {
      let add:addRestrictedLabel = { name: 'AddLabel', type: 'Code'};
      await service.addRestrictedLabel(add).then((res:string) => {
        expect(res).toBeDefined();
        expect(res.length).toBeGreaterThan(10);
      })
    });
  });

  describe('updateRestrictedLabel', () => {
    it('Test to update an existing label',async () => {
      await service.updateRestrictedLabel(restrictedLabelFullList[0]._id.toString(), 'UpdatedName').then((res:updateRestrictedLabel) => {
        expect(res).toBeDefined();
        expect(res.name).toBe('UpdatedName');
        expect(res.id).toBe(restrictedLabelFullList[0]._id.toString());
      })
    });
    it('Test to update with an unknown id',async () => {
      try {
        let res = await service.updateRestrictedLabel(new ObjectId().toString(), 'NotFound');
        expect(res).toBeNull();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
    it('Test to update with an invalid id',async () => {
      try {
        let res = await service.updateRestrictedLabel('kihg654zef4561zef', 'NotFound');
        expect(res).toBeNull();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('deleteRestrictedLabel', () => {
    it('Test to delete an existing label',async () => {
      try {
        await service.deleteRestrictedLabel(restrictedLabelFullList[0]._id.toString());
        expect(1).toBe(1);
      }
      catch(error) {
        expect(error).toBeNull();
      }
    });
    it('Test to delete with an unknown id',async () => {
      try {
        await service.deleteRestrictedLabel((new ObjectId()).toString());
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('Without MongoDb Connection',() => {
    it('getRestrictedLabels return 500',async () => {
      mockMongoConnectionOff();
      try { 
        await service.getRestrictedLabels();
        expect(1).toBe(2);
      } catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Mongo is dead');
      }
    });
    it('addRestrictedLabel return 500',async () => {
      try { 
        await service.addRestrictedLabel({name:'', type: ''});
        expect(1).toBe(2);
      } catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Mongo is dead');
      }
    });
    it('updateRestrictedLabel return 500',async () => {
      try { 
        await service.updateRestrictedLabel('','');
        expect(1).toBe(2);
      } catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Mongo is dead');
      }
    });
    it('deleteRestrictedLabel return 500',async () => {
      try { 
        await service.deleteRestrictedLabel('');
        expect(1).toBe(2);
      } catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Mongo is dead');
      }
      clearMockConnection();
    });
  });

  function mockMongoConnectionOff() {
    mockConnectionOff = jest.spyOn(db, 'collection');
    mockConnectionOff.mockImplementation((name:string) => { 
      throw new InternalServerErrorException('Mongo is dead');
    });
  }
  function clearMockConnection() {
    mockConnectionOff.mockClear();
  }
});

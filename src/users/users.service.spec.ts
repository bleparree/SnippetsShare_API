import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { GetUser } from './dto/getUser.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mongod:MongoMemoryServer;
  let client:MongoClient;
  let db:Db;
  const userFullList = [
    { _id: new ObjectId(), userName:'benoît', password: 'qs5f41fqs0', eMail: 'ben@test.fr', role: 'SuperAdmin', status: 'Activated' },
    { _id: new ObjectId(), userName:'Thomas', password: 'qs5f41fqs0', eMail: 'tom@testmail.com', role: 'User', status: 'ToActivate' },
    { _id: new ObjectId(), userName:'Jean-Christophe', password: 'qs5f41fqs0', eMail: 'jc@toto.fr', role: 'User', status: 'Activated' },
    { _id: new ObjectId(), userName:'Ludovic', password: 'qs5f41fqs0', eMail: 'ludovic@test.fr', role: 'User', status: 'Activated' },
    { _id: new ObjectId(), userName:'wiDad', password: 'qs5f41fqs0', eMail: 'wiwi@testmail.com', role: 'User', status: 'ReInitPassword' },
    { _id: new ObjectId(), userName:'Jess', password: 'qs5f41fqs0', eMail: 'jesca@toto.fr', role: 'User', status: 'Activated' },
    { _id: new ObjectId(), userName:'Céline', password: 'qs5f41fqs0', eMail: 'celine@test.fr', role: 'User', status: 'Activated' },
    { _id: new ObjectId(), userName:'Caroline', password: 'qs5f41fqs0', eMail: 'caro@testmail.com', role: 'User', status: 'Suspended' },
  ];
  let mockConnectionOff;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create({ instance: { dbName: 'SnippetsShare'}});
    client = new MongoClient(mongod.getUri());
    db = client.db('SnippetsShare');

    await db.collection('User').insertMany(userFullList);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'MONGO_CLIENT', useValue: db },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    client.close();
    mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('Test to get an existing user', async () => {
      await service.getUser(userFullList[0]._id.toString()).then((res:User) => {
        // let convert = new GetUser();
        // convert.initWithMongoObject(userFullList[0])
        expect(res).toStrictEqual(new GetUser(userFullList[0]));
      });
    });
    it('Test to get an non existent user', async () => {
      try {
        let res = await service.getUser(new ObjectId().toString());
        expect(res).toBeNull()
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
    it('Test to get with a wrongly composed id', async () => {
      try {
        let res = await service.getUser('badid');
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
      }
    });
  });
  
  describe('getUsers', () => {
    it('Test to get the entire list without filter', async () => {
      let res = await service.getUsers();
      expect(res).toStrictEqual(userFullList.map(val => new GetUser(val)));
    });
    // it('Test to get the list filtered by a username', async () => {});
    // it('Test to get the list filtered by an email', async () => {});
    // it('Test to get the list filtered by a part of mail + username', async () => {});
    // it('Test to get the list filtered by superadmin role', async () => {});
    // it('Test to get the list filtered by ToActivate status', async () => {});
    // it('Test to get the list with searchname test.fr and role user and status Activated', async () => {});
    // it('Test to get the list with searchname widad (different case) and status ReInitPassword', async () => {});
    // it('Test to get something who don't exist', async () => {});
  });

  describe('addUser', () => {
    // it('Test to add a user', async () => {});
  });

  describe('updateUser', () => {
    // it('Test to update a user', async () => {});
    // it('Test to update an unknow id', async () => {});
  });

  describe('updateUser_UserName', () => {
    // it('Test to update the user uersname', async () => {});
    // it('Test to update an unknow id', async () => {});
  });

  describe('updateUser_Password', () => {
    // it('Test to update the user password', async () => {});
    // it('Test to update an unknow id', async () => {});
  });

  describe('updateUser_Status', () => {
    // it('Test to update the user status', async () => {});
    // it('Test to update an unknow id', async () => {});
  });

  // describe('resetPassword', () => {});

  describe('deleteUser', () => {
    // it('Test to delete a user', async () => {});
    // it('Test to delete an unknow id', async () => {});
  });
  
  describe('Without MongoDb Connection',() => {
    it('getUser return 500',async () => {
      mockMongoConnectionOff();
      try { 
        await service.getUser(new ObjectId().toString());
        expect(1).toBe(2);
      } catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Mongo is dead');
      }
    });
    it('getUsers return 500',async () => {
      try { 
        await service.getUsers();
        expect(1).toBe(2);
      } catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Mongo is dead');
      }
    });
    it('updateUser return 500',async () => {
      try { 
        await service.updateUser_UserName('','');
        expect(1).toBe(2);
      } catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Mongo is dead');
      }
    });
    it('deleteRestrictedLabel return 500',async () => {
      try { 
        await service.deleteUser('');
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

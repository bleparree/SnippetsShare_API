import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { InternalServerErrorException } from '@nestjs/common';

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
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
  });
  describe('getUsers', () => {
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
  });
  describe('addUser', () => {
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
  });
  describe('updateUser', () => {
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
  });
  describe('updateUser_UserName', () => {
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
  });
  describe('updateUser_Password', () => {
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
  });
  describe('updateUser_Status', () => {
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
  });
  // describe('resetPassword', () => {});
  describe('deleteUser', () => {
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
    // it('', async () => {});
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

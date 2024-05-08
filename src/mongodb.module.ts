import { Module } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { RestrictedLabelMock } from './resources/mock/restricted-labels-mock';
import { UserMock } from './resources/mock/user-mock';
import { SnippetMock } from './resources/mock/snippet-mock';

@Module({
  providers: [
    {
      provide: 'MONGO_CLIENT',
      useFactory: async () => {
        const dbName = 'SnippetsShare';
        if (process.env.NODE_ENV == 'test') {
          const mongod:MongoMemoryServer = await MongoMemoryServer.create({ instance: { dbName: dbName}, spawn: {timeout: 60000}});
          const client:MongoClient = new MongoClient(mongod.getUri());
          await (new RestrictedLabelMock()).fullListMongoInsert(client,dbName);
          await (new UserMock()).fullListMongoInsert(client,dbName);
          await (new SnippetMock()).fullListMongoInsert(client,dbName);
          return new MongoDbObject(client, dbName);
        }
        else {
          let connectionString = 'mongodb+srv://benoitleparree:FOCpHxSqBpT4BFQl@bleparree-cluster.izzh018.mongodb.net/?retryWrites=true&w=majority&appName=bleparree-cluster';
          if (process.env.COMPUTERNAME = 'MALBU051') connectionString = 'mongodb://localhost:27017';
          const client = new MongoClient(connectionString);
          await client.connect();
          return new MongoDbObject(client, dbName);
        }
      },
    },
  ],
  exports: ['MONGO_CLIENT'],
})
export class MongodbModule {}

export class MongoDbObject {
  client:MongoClient;
  dbName:string;

  constructor(client:MongoClient, dbName:string) {
    this.client = client;
    this.dbName = dbName;
  }

  db(): Db {
    return this.client.db('SnippetsShare');
  }
}
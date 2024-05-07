import { Module } from '@nestjs/common';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({
  providers: [
    {
      provide: 'MONGO_CLIENT',
      useFactory: async () => {
        if (process.env.NODE_ENV == 'test') {
          const restrictedLabelFullList = [
            { _id: new ObjectId('663a327d6d876ca25d0de464'), name:'Test1', type: 'Code' },
            { _id: new ObjectId('663a32886af15c98cf60bf09'), name:'Test2', type: 'Repository' },
            { _id: new ObjectId('663a328c9e131a31ca2176ce'), name:'Test3', type: 'FreeLabel' },
            { _id: new ObjectId('663a328ffa67daf36c254da9'), name:'Test4', type: 'Code' },
            { _id: new ObjectId('663a3292dd50b981d7553e92'), name:'MyTest1', type: 'FreeLabel' },
            { _id: new ObjectId('663a32963b2ef702cd219e1f'), name:'MyTest2', type: 'Repository' },
            { _id: new ObjectId('663a329a98cbfb072df06d88'), name:'MyTest3', type: 'Code' },
          ];
          
          let mongod:MongoMemoryServer = await MongoMemoryServer.create({ instance: { dbName: 'SnippetsShare'}, spawn: {timeout: 60000}});
          let client:MongoClient = new MongoClient(mongod.getUri());
          let db:Db = client.db('SnippetsShare');
          await db.collection('RestrictedLabel').insertMany(restrictedLabelFullList);
          return db;
        }
        else {
          let connectionString = 'mongodb+srv://benoitleparree:FOCpHxSqBpT4BFQl@bleparree-cluster.izzh018.mongodb.net/?retryWrites=true&w=majority&appName=bleparree-cluster';
          if (process.env.COMPUTERNAME = 'MALBU051') connectionString = 'mongodb://localhost:27017';
          const client = new MongoClient(connectionString);
          await client.connect();
          return client.db('SnippetsShare');
          // return new MongoDbObject(client, 'SnippetsShare');
        }
      },
    },
  ],
  exports: ['MONGO_CLIENT'],
})
export class MongodbModule {}

// export class MongoDbObject {
//   client:MongoClient;
//   dbName:string;

//   constructor(client:MongoClient, dbName:string) {
//     this.client = client;
//     this.dbName = dbName;
//   }

//   db(): Db {
//     return this.client.db('SnippetsShare');
//   }
// }
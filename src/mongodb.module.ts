import { Module } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'MONGO_CLIENT',
      useFactory: async () => {
        // const atlasCS = 'mongodb+srv://benoitleparree:FOCpHxSqBpT4BFQl@bleparree-cluster.izzh018.mongodb.net/?retryWrites=true&w=majority&appName=bleparree-cluster';
        const localCS = 'mongodb://localhost:27017';
        const client = new MongoClient(localCS);
        await client.connect();
        return client.db('SnippetsShare');
      },
    },
  ],
  exports: ['MONGO_CLIENT'],
})
export class MongodbModule {}
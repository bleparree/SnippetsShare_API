import { MongoClient, ObjectId } from "mongodb";

export class RestrictedLabelMock {
    fullList = [
        { _id: new ObjectId('663a327d6d876ca25d0de464'), name:'Test1', type: 'Code' },
        { _id: new ObjectId('663a32886af15c98cf60bf09'), name:'Test2', type: 'Repository' },
        { _id: new ObjectId('663a328c9e131a31ca2176ce'), name:'Test3', type: 'FreeLabel' },
        { _id: new ObjectId('663a328ffa67daf36c254da9'), name:'Test4', type: 'Code' },
        { _id: new ObjectId('663a3292dd50b981d7553e92'), name:'MyTest1', type: 'FreeLabel' },
        { _id: new ObjectId('663a32963b2ef702cd219e1f'), name:'MyTest2', type: 'Repository' },
        { _id: new ObjectId('663a329a98cbfb072df06d88'), name:'MyTest3', type: 'Code' },
    ];

    async fullListMongoInsert(client:MongoClient, dbName:string) {
        await client.db(dbName).collection('RestrictedLabel').insertMany(this.fullList);
    }
}
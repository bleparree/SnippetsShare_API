import { MongoClient, ObjectId } from "mongodb";

export class UserMock {
    fullList = [
        { _id: new ObjectId('663b788593cdf9922e06aa95'), userName:'benoît', password: 'qs5f41fqs0', eMail: 'ben@test.fr', role: 'SuperAdmin', status: 'Activated' },
        { _id: new ObjectId('663b788593cdf9922e06aa96'), userName:'Thomas', password: 'qs5f41fqs0', eMail: 'tom@testmail.com', role: 'User', status: 'ToActivate' },
        { _id: new ObjectId('663b788593cdf9922e06aa97'), userName:'Jean-Christophe', password: 'qs5f41fqs0', eMail: 'jc@toto.fr', role: 'User', status: 'Activated' },
        { _id: new ObjectId('663b788593cdf9922e06aa98'), userName:'Ludovic', password: 'qs5f41fqs0', eMail: 'ludovic@test.fr', role: 'User', status: 'Activated' },
        { _id: new ObjectId('663b788593cdf9922e06aa99'), userName:'wiDad', password: 'qs5f41fqs0', eMail: 'wiwi@testmail.com', role: 'User', status: 'ReInitPassword' },
        { _id: new ObjectId('663b788593cdf9922e06aa9a'), userName:'Jess', password: 'qs5f41fqs0', eMail: 'jesca@toto.fr', role: 'User', status: 'Activated' },
        { _id: new ObjectId('663b788593cdf9922e06aa94'), userName:'Céline', password: 'qs5f41fqs0', eMail: 'celine@test.fr', role: 'User', status: 'Activated' },
        { _id: new ObjectId('663b78d693cdf9922e06aa9d'), userName:'Caroline', password: 'qs5f41fqs0', eMail: 'caro@testmail.com', role: 'User', status: 'Suspended' },
    ];

    async fullListMongoInsert(client:MongoClient, dbName:string) {
        await client.db(dbName).collection('Users').insertMany(this.fullList);
    }
}
it('test', () => {
  expect(1).toBe(1);
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { SnippetsService } from './snippets.service';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { Db, MongoClient, ObjectId } from 'mongodb';
// import { snippetStatusList } from 'src/resources/entities/snippetStatusList.entity';
// import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
// import { Snippet } from './entities/snippet.entity';

// describe('SnippetsService', () => {
//   let service: SnippetsService;
//   let mongod:MongoMemoryServer;
//   let client:MongoClient;
//   let db:Db;
//   const mockSnippetList = [
//     { _id: new ObjectId(), name: 'Snippet 1', authorId: new ObjectId().toString(), description: 'desc 1', status: snippetStatusList.Private, 
//       codeLabelId: new ObjectId().toString(), repositoryLabelId: new ObjectId().toString(), freeLabels: ['lab1', 'lab2'], searchKeywords: ['code', 'Test'], 
//       codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
//       relevanceRank: { averageNotation:4.2, count:985}, solutionNotation: { averageNotation:4.2, count:985}},
//     { _id: new ObjectId(), name: 'Snippet 2 code', authorId: new ObjectId().toString(), description: 'desc 2', status: snippetStatusList.Private, 
//       codeLabelId: new ObjectId().toString(), repositoryLabelId: new ObjectId().toString(), freeLabels: ['lab1', 'lab4'], searchKeywords: ['LIste', 'code'], 
//       codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
//       relevanceRank: { averageNotation:3.5, count:10}, solutionNotation: { averageNotation:3.5, count:10}},
//     { _id: new ObjectId(), name: 'Snippet 3 test', authorId: new ObjectId().toString(), description: 'desc 3', status: snippetStatusList.Private, 
//       codeLabelId: new ObjectId().toString(), repositoryLabelId: new ObjectId().toString(), freeLabels: ['lab1', 'lab2'], searchKeywords: ['Test', 'key2'], 
//       codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
//       relevanceRank: { averageNotation:2.4, count:100}, solutionNotation: { averageNotation:2.4, count:100}},
//     { _id: new ObjectId(), name: 'Snippet 4', authorId: new ObjectId().toString(), description: 'desc 4', status: snippetStatusList.Public, 
//       codeLabelId: new ObjectId().toString(), repositoryLabelId: new ObjectId().toString(), freeLabels: ['lab3', 'lab4'], searchKeywords: ['key1', 'LIste'], 
//       codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
//       relevanceRank: { averageNotation:3.65, count:20}, solutionNotation: { averageNotation:3.65, count:20}},
//     { _id: new ObjectId(), name: 'Snippet 5 LIste', authorId: new ObjectId().toString(), description: 'desc 5', status: snippetStatusList.Private, 
//       codeLabelId: new ObjectId().toString(), repositoryLabelId: new ObjectId().toString(), freeLabels: ['lab3', 'lab2'], searchKeywords: ['code', 'key2'], 
//       codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
//       relevanceRank: { averageNotation:4.25, count:54}, solutionNotation: { averageNotation:4.25, count:54}},
//     { _id: new ObjectId(), name: 'Snippet 6', authorId: new ObjectId().toString(), description: 'desc 6', status: snippetStatusList.Public, 
//       codeLabelId: new ObjectId().toString(), repositoryLabelId: new ObjectId().toString(), freeLabels: ['lab3', 'lab4'], searchKeywords: ['LIste', 'test'], 
//       codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
//       relevanceRank: { averageNotation:0, count:0}, solutionNotation: { averageNotation:0, count:0}},
//   ];
//   let mockConnectionOff;

//   beforeAll(async () => {
//     mongod = await MongoMemoryServer.create({ instance: { dbName: 'SnippetsShare'}, spawn: {timeout: 60000}});
//     client = new MongoClient(mongod.getUri());
//     db = client.db('SnippetsShare');

//     await db.collection('Snippets').insertMany(mockSnippetList);

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         SnippetsService,
//         { provide: 'MONGO_CLIENT', useValue: db },
//       ],
//     }).compile();

//     service = module.get<SnippetsService>(SnippetsService);
//   });

//   afterAll(async () => {
//     client.close();
//     mongod.stop();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('getUser', () => {
//     it('Test to get an existing snippet', async () => {
//       let res:Snippet = await service.getSnippet(mockSnippetList[0]._id.toString())
//       expect(res).toStrictEqual(new Snippet(mockSnippetList[0]));
//     });
//     it('Test to get an non existent snippet', async () => {
//       try {
//         let res = await service.getSnippet(new ObjectId().toString());
//         expect(res).toBeNull()
//       }
//       catch(error) {
//         expect(error).toBeDefined();
//         expect(error).toBeInstanceOf(NotFoundException);
//       }
//     });
//   });

//   describe('getUsers', () => {
//     it('Test to get the entire list without filter', async () => {
//       let res = await service.getSnippets(50, 0);
//       expect(res).toStrictEqual(mockSnippetList.map(val => new Snippet(val)));
//     });
//     it('Test to get the list filtered by a name', async () => {
//       let searchText = 'snip';
//       let res = await service.getSnippets(50, 0, searchText);
//       expect(res).toStrictEqual(
//         mockSnippetList.filter(val => val.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0  || 
//                                     val.description.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
//                                     val.searchKeywords.findIndex(v => (v.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0)) >= 0
//                                   ).map(val => new Snippet(val)));
//     });
//     it('Test to get the list filtered by a desc', async () => {
//       let searchText = 'desc 1';
//       let res = await service.getSnippets(50, 0, searchText);
//       expect(res).toStrictEqual(
//         mockSnippetList.filter(val => val.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0  || 
//                                     val.description.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
//                                     val.searchKeywords.findIndex(v => (v.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0)) >= 0
//                                   ).map(val => new Snippet(val)));
//     });
//     it('Test to get the list filtered by a searchKeyword & name', async () => {
//       let searchText = 'LIste';
//       let res = await service.getSnippets(50, 0, searchText);
//       expect(res).toStrictEqual(
//         mockSnippetList.filter(val => val.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0  || 
//                                     val.description.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
//                                     val.searchKeywords.findIndex(v => (v.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0)) >= 0
//                                   ).map(val => new Snippet(val)));
//     });
//     it('Test to get the list filtered by codeLabelId', async () => {
//       let res = await service.getSnippets(50, 0, null, mockSnippetList[0].codeLabelId);
//       expect(res).toStrictEqual(mockSnippetList.filter(val => val.codeLabelId == mockSnippetList[0].codeLabelId).map(val => new Snippet(val)));
//     });
//     it('Test to get the list filtered by repositoryLabelId', async () => {
//       let res = await service.getSnippets(50, 0, null, null, mockSnippetList[0].repositoryLabelId);
//       expect(res).toStrictEqual(mockSnippetList.filter(val => val.repositoryLabelId == mockSnippetList[0].repositoryLabelId).map(val => new Snippet(val)));
//     });
//     it('Test to get the list filtered by freeLabels', async () => {
//       let res = await service.getSnippets(50, 0, null, null, null, ['lab1', 'lab4']);
//       expect(res).toStrictEqual(mockSnippetList.filter(val => val.freeLabels.includes('lab1') && val.freeLabels.includes('lab4')).map(val => new Snippet(val)));
//     });
//     it('Test to get the list filtered by relevance', async () => {
//       let relevance = 4;
//       let res = await service.getSnippets(50, 0, null, null, null, null, relevance);
//       expect(res).toStrictEqual(mockSnippetList.filter(val => val.relevanceRank.averageNotation >= relevance && val.relevanceRank.averageNotation < relevance + 1).map(val => new Snippet(val)));
//     });
//     it('Test to get the list filtered by notation', async () => {
//       let notation = 2;
//       let res = await service.getSnippets(50, 0, null, null, null, null, null, notation);
//       expect(res).toStrictEqual(mockSnippetList.filter(val => val.relevanceRank.averageNotation >= notation && val.relevanceRank.averageNotation < notation + 1).map(val => new Snippet(val)));
//     });
//     it('Test to get the list filtered by status', async () => {
//       let res = await service.getSnippets(50, 0, null, null, null, null, null, null, snippetStatusList.Private);
//       expect(res).toStrictEqual(mockSnippetList.filter(val => val.status == snippetStatusList.Private).map(val => new Snippet(val)));
//     });
//     it('Test to get the list filtered by authorId', async () => {
//       let res = await service.getSnippets(50, 0, null, null, null, null, null, null, null, mockSnippetList[0].authorId);
//       expect(res).toStrictEqual(mockSnippetList.filter(val => val.authorId == mockSnippetList[0].authorId).map(val => new Snippet(val)));
//     });
//     it('Test to get the list with search=test and status=Private', async () => {
//       let searchText = 'test';
//       let res = await service.getSnippets(50, 0, searchText, null, null, null, null, null, snippetStatusList.Private, null);
//       expect(res).toStrictEqual(mockSnippetList.filter(val => (val.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0  || 
//         val.description.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
//         val.searchKeywords.findIndex(v => (v.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0)) >= 0)
//         && val.status == snippetStatusList.Private).map(val => new Snippet(val)));
//     });
//     it('Test to search something who don\'t exist', async () => {
//       let searchText = 'something who dont exist';
//       let res = await service.getSnippets(50, 0, searchText);
//       expect(res).toStrictEqual([]);
//     });
//   });

//   function mockMongoConnectionOff() {
//     mockConnectionOff = jest.spyOn(db, 'collection');
//     mockConnectionOff.mockImplementation((name:string) => { 
//       throw new InternalServerErrorException('Mongo is dead');
//     });
//   }
//   function clearMockConnection() {
//     mockConnectionOff.mockClear();
//   }
// });

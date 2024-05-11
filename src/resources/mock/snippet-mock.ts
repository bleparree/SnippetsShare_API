import { MongoClient, ObjectId } from "mongodb";
import { snippetStatusList } from "../entities/snippetStatusList.entity";

export class SnippetMock {
    fullList = [
        { _id: new ObjectId('663b79f193cdf9922e06aa9f'), name: 'Snippet 1', authorId: '663b79f193cdf9922e06aaa2', description: 'desc 1', status: snippetStatusList.Private, 
          codeLabelId: '663b79f193cdf9922e06aaa0', repositoryLabelId: '663b79f193cdf9922e06aaa1', freeLabels: ['lab1', 'lab2'], searchKeywords: ['code', 'Test'], 
          codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
          relevanceRank: { averageNotation:4.2, count:4}, solutionNotation: { averageNotation:4.2, count:8}},
        { _id: new ObjectId('663b79f193cdf9922e06aaa6'), name: 'Snippet 2 code', authorId: '663b79f193cdf9922e06aaa3', description: 'desc 2', status: snippetStatusList.Private, 
          codeLabelId: '663b79f193cdf9922e06aaa5', repositoryLabelId: '663b79f193cdf9922e06aaa4', freeLabels: ['lab1', 'lab4'], searchKeywords: ['LIste', 'code'], 
          codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
          relevanceRank: { averageNotation:3.5, count:10}, solutionNotation: { averageNotation:3.5, count:10}},
        { _id: new ObjectId('663b79f193cdf9922e06aaa7'), name: 'Snippet 3 test', authorId: '663b79f193cdf9922e06aaaa', description: 'desc 3', status: snippetStatusList.Private, 
          codeLabelId: '663b79f193cdf9922e06aaa8', repositoryLabelId: '663b79f193cdf9922e06aaa9', freeLabels: ['lab1', 'lab2'], searchKeywords: ['Test', 'key2'], 
          codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
          relevanceRank: { averageNotation:2.4, count:100}, solutionNotation: { averageNotation:2.4, count:100}},
        { _id: new ObjectId('663b79f193cdf9922e06aaae'), name: 'Snippet 4', authorId: '663b79f193cdf9922e06aaab', description: 'desc 4', status: snippetStatusList.Public, 
          codeLabelId: '663b79f193cdf9922e06aaad', repositoryLabelId: '663b79f193cdf9922e06aaac', freeLabels: ['lab3', 'lab4'], searchKeywords: ['key1', 'LIste'], 
          codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
          relevanceRank: { averageNotation:3.65, count:20}, solutionNotation: { averageNotation:3.65, count:20}},
        { _id: new ObjectId('663b79f193cdf9922e06aaaf'), name: 'Snippet 5 LIste', authorId: '663b7a5f93cdf9922e06aab3', description: 'desc 5', status: snippetStatusList.Private, 
          codeLabelId: '663b79f193cdf9922e06aab1', repositoryLabelId: '663b7a5f93cdf9922e06aab4', freeLabels: ['lab3', 'lab2'], searchKeywords: ['code', 'key2'], 
          codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
          relevanceRank: { averageNotation:4.25, count:54}, solutionNotation: { averageNotation:4.25, count:54}},
        { _id: new ObjectId('663b79f193cdf9922e06aab0'), name: 'Snippet 6', authorId: '663b7a5f93cdf9922e06aab5', description: 'desc 6', status: snippetStatusList.Public, 
          codeLabelId: '663b79f193cdf9922e06aab2', repositoryLabelId: '663b7a5f93cdf9922e06aab6', freeLabels: ['lab3', 'lab4'], searchKeywords: ['LIste', 'test'], 
          codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
          relevanceRank: { averageNotation:0, count:0}, solutionNotation: { averageNotation:0, count:0}},
    ];

    async fullListMongoInsert(client:MongoClient, dbName:string) {
        await client.db(dbName).collection('Snippets').insertMany(this.fullList);
    }
}
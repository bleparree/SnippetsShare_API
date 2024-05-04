import { Test, TestingModule } from '@nestjs/testing';
import { SnippetsController } from './snippets.controller';
import { SnippetsService } from './snippets.service';
import { INestApplication } from '@nestjs/common';
import { Snippet } from './entities/snippet.entity';
import { ObjectId } from 'mongodb';
import { snippetStatusList } from 'src/resources/entities/snippetStatusList.entity';
import supertest from 'supertest';

describe('SnippetsController', () => {
  let controller: SnippetsController;
  let app: INestApplication;
  let snippetsService = new SnippetsService(null);
  let validObjectId = new ObjectId().toString();
  const mockSnippetList: Snippet[] = [
    { id: new ObjectId().toString(), name: 'Snippet 1', authorId: new ObjectId().toString(), description: 'desc 1', status: snippetStatusList.Private, 
      codeLabelId: new ObjectId().toString(), repositoryLabelId: new ObjectId().toString(), freeLabels: ['lab1', 'lab2'], searchKeyword: ['key1', 'key2'], 
      codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
      relevanceRank: { averageNotation:0, count:0}, solutionNotation: { averageNotation:0, count:0}}
  ];
  let usedSnippetList: Snippet[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnippetsController],
      providers: [SnippetsService],
    })
    .overrideProvider(SnippetsService).useValue(snippetsService)
    .compile();

    usedSnippetList = mockSnippetList;
    controller = module.get<SnippetsController>(SnippetsController);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSnippet tests cases', () => {
    const mock = jest.spyOn(snippetsService, 'getSnippet');
    mock.mockImplementation((id:string) => { 
      return new Promise((resolve, reject) => { 
        resolve(usedSnippetList[0])
      }); 
    });
    it('Call should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get('/snippets/' + validObjectId).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList[0]);
    });
    it('Call with invalid mongoId should return a 400', async () => {
      await supertest(app.getHttpServer()).get('/snippets/invalidObjectId').expect(400);
    });
    mock.mockClear();
  });

  describe('getSnippets tests cases', () => {
    const mock = jest.spyOn(snippetsService, 'getSnippets');
    mock.mockImplementation((
      limit: number,
      offset: number,
      search?: string,
      codeLabelId?: string,
      repositoryLabelId?: string,
      freeLabels?: string[],
      relevance?: number,
      notation?: number,
      status?: snippetStatusList,
      authorId?: string) => { 
      return new Promise((resolve, reject) => { 
        resolve(usedSnippetList)
      }); 
    });
    it('Call without param should return a 200 - Check default limit and offset', async () => {
      let res = await supertest(app.getHttpServer()).get('/snippets').expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with codeLabelId param should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get('/snippets?codeLabelId=' + validObjectId).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with repositoryLabelId param should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get('/snippets?codeLabelId=' + validObjectId).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    // it('Call with ONE freeLabel param should return a 200', async () => {});
    // it('Call with TWO freeLabel param should return a 200', async () => {});
    // it('Call with relevance param should return a 200', async () => {});
    // it('Call with relevance IN TEXT param should return a 400', async () => {});
    // it('Call with notation param should return a 200', async () => {});
    // it('Call with notation IN TEXT param should return a 400', async () => {});
    // it('Call with status param should return a 200', async () => {});
    // it('Call with status param WITH WRONG VALUE should return a 400', async () => {});
    // it('Call with authorId param should return a 200', async () => {});
    // it('Call with limit param should return a 200', async () => {});
    // it('Call with limit IN TEXT param should return a 400', async () => {});
    // it('Call with offset param should return a 200', async () => {});
    // it('Call with offset IN TEXT param should return a 400', async () => {});
    // it('Call with MULTIPLE PARAM should return a 200', async () => {});
  });

  describe('addSnippet tests cases', () => {
    // it('Call with a correct entity should return a 201', async () => {});
    // it('Call without entity should return a 400', async () => {});
    // it('Call with a wrong entity should return a 400', async () => {});
  });

  describe('updateSnippet tests cases', () => {
    // it('Call with a correct entity should return a 200', async () => {});
    // it('Call without entity should return a 400', async () => {});
    // it('Call with a wrong entity should return a 400', async () => {});
  });

  describe('addSnippetNotation tests cases', () => {
    // it('Call with a correct notation should return a 200', async () => {});
    // it('Call without id should return a 400', async () => {});
    // it('Call with WRONG id should return a 400', async () => {});
    // it('Call without notation should return a 400', async () => {});
    // it('Call with WRONG notation should return a 400', async () => {});
  });

  describe('addSnippetRelevance tests cases', () => {
    // it('Call with a correct Relevance should return a 200', async () => {});
    // it('Call without id should return a 400', async () => {});
    // it('Call with WRONG id should return a 400', async () => {});
    // it('Call without Relevance should return a 400', async () => {});
    // it('Call with WRONG Relevance should return a 400', async () => {});
  });

  describe('updateSnippetStatus tests cases', () => {
    // it('Call with a correct Status should return a 200', async () => {});
    // it('Call without id should return a 400', async () => {});
    // it('Call with WRONG id should return a 400', async () => {});
    // it('Call without Status should return a 400', async () => {});
    // it('Call with WRONG Status should return a 400', async () => {});
  });

  describe('addSnippetComment tests cases', () => {
    // it('Call with a correct Comment should return a 200', async () => {});
    // it('Call without id should return a 400', async () => {});
    // it('Call with WRONG id should return a 400', async () => {});
    // it('Call without Comment should return a 400', async () => {});
    // it('Call with WRONG Comment should return a 400', async () => {});
  });

  describe('deleteSnippetComment tests cases', () => {
    // it('Call with a correct Comment should return a 200', async () => {});
    // it('Call without id should return a 400', async () => {});
    // it('Call with WRONG id should return a 400', async () => {});
  });

  describe('deleteSnippet tests cases', () => {
    // it('Call with a correct Comment should return a 200', async () => {});
    // it('Call without id should return a 400', async () => {});
    // it('Call with WRONG id should return a 400', async () => {});
  });
});

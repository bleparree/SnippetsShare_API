import { Test, TestingModule } from '@nestjs/testing';
import { SnippetsController } from './snippets.controller';
import { SnippetsService } from './snippets.service';
import { INestApplication } from '@nestjs/common';
import { Snippet } from './entities/snippet.entity';
import { ObjectId } from 'mongodb';
import { snippetStatusList } from 'src/resources/entities/snippetStatusList.entity';
import supertest from 'supertest';
import { AddSnippet } from './dto/addSnippet.dto';
import { UpdateSnippet } from './dto/updateSnippet.dto';
import { AddSnippetComment } from './dto/addSnippetComment.dto';
import { Snippet_comments } from './entities/snippet_comments.entity';

describe('SnippetsController', () => {
  let controller: SnippetsController;
  let app: INestApplication;
  const snippetsService = new SnippetsService(null);
  const validObjectId = new ObjectId().toString();
  const mockSnippetList: Snippet[] = [
    { id: new ObjectId().toString(), name: 'Snippet 1', authorId: new ObjectId().toString(), description: 'desc 1', status: snippetStatusList.Private, 
      codeLabelId: new ObjectId().toString(), repositoryLabelId: new ObjectId().toString(), freeLabels: ['lab1', 'lab2'], searchKeywords: ['key1', 'key2'], 
      codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }], comments: [], 
      relevanceRank: { averageNotation:0, count:0}, solutionNotation: { averageNotation:0, count:0}}
  ];
  const addSnippetObject:AddSnippet = { name: 'Snippet 1', authorId: new ObjectId().toString(), description: 'desc 1', status: snippetStatusList.Private, 
    codeLabelId: new ObjectId().toString(), repositoryLabelId: new ObjectId().toString(), freeLabels: ['lab1', 'lab2'], searchKeywords: ['key1', 'key2'], 
    codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }]};
  const updateSnippetObject:UpdateSnippet = { name: 'Snippet 1', authorId: new ObjectId().toString(), description: 'desc 1', status: snippetStatusList.Private, 
    codeLabelId: new ObjectId().toString(), repositoryLabelId: new ObjectId().toString(), freeLabels: ['lab1', 'lab2'], searchKeywords: ['key1', 'key2'], 
    codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }]};
  const addSnippetCommentObject:AddSnippetComment = { authorId: validObjectId.toString(), comment: 'Tarladidada' };
  const snippetCommentObject:Snippet_comments = { id: validObjectId.toString(), date: new Date(), authorId: validObjectId.toString(), comment: 'Tarladidada' };
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
      let res = await supertest(app.getHttpServer()).get('/snippets?repositoryLabelId=' + validObjectId).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with ONE freeLabel param should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get('/snippets?freeLabels=' + validObjectId).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with TWO freeLabel param should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get(`/snippets?freeLabels=${validObjectId}&freeLabels=${validObjectId}`).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with relevance param should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get(`/snippets?relevance=4`).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with relevance IN TEXT param should return a 400', async () => {
      await supertest(app.getHttpServer()).get(`/snippets?relevance=toto`).expect(400);
    });
    it('Call with notation param should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get(`/snippets?notation=4`).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with notation IN TEXT param should return a 400', async () => {
      await supertest(app.getHttpServer()).get(`/snippets?notation=toto`).expect(400);
    });
    it('Call with status param should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get(`/snippets?status=${snippetStatusList.Private}`).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with status param WITH WRONG VALUE should return a 400', async () => {
      await supertest(app.getHttpServer()).get(`/snippets?status=toto`).expect(400);
    });
    it('Call with authorId param should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get(`/snippets?authorId=${validObjectId}`).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with limit param should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get(`/snippets?limit=20`).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with limit IN TEXT param should return a 400', async () => {
      await supertest(app.getHttpServer()).get(`/snippets?limit=toto`).expect(400);
    });
    it('Call with offset param should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get(`/snippets?offset=50`).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    it('Call with offset IN TEXT param should return a 400', async () => {
      await supertest(app.getHttpServer()).get(`/snippets?offset=toto`).expect(400);
    });
    it('Call with MULTIPLE PARAM should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).get(`/snippets?limit=20&offset=60&status=${snippetStatusList.Private}&notation=4`).expect(200);
      expect(res.body).toStrictEqual(usedSnippetList);
    });
    mock.mockClear();
  });

  describe('addSnippet tests cases', () => {
    const mock = jest.spyOn(snippetsService, 'addSnippet');
    mock.mockImplementation((entity:AddSnippet) => { 
      return new Promise((resolve, reject) => { 
        resolve(usedSnippetList[0].id)
      }); 
    });
    it('Call with a correct entity should return a 201', async () => {
      let res = await supertest(app.getHttpServer()).post('/snippets')
        .send(addSnippetObject).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(201);
      expect(res.text).toBe(usedSnippetList[0].id);
    });
    it('Call without entity should return a 400', async () => {
      await supertest(app.getHttpServer()).post('/snippets')
      .set('Content-Type', 'application/json').set('Accept', 'application/json')
      .expect(400);
    });
    it('Call with a wrong entity should return a 400', async () => {
      let wrongAddSnippet = addSnippetObject;
      wrongAddSnippet.name = '';
      await supertest(app.getHttpServer()).post('/snippets')
        .send(wrongAddSnippet).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(400);
    });
    mock.mockClear();
  });

  describe('updateSnippet tests cases', () => {
    const mock = jest.spyOn(snippetsService, 'updateSnippet');
    mock.mockImplementation((id:string, entity:UpdateSnippet) => { 
      return new Promise((resolve, reject) => { 
        resolve(updateSnippetObject)
      }); 
    });
    it('Call with a correct entity should return a 200', async () => {
      let res = await supertest(app.getHttpServer()).put('/snippets/' + validObjectId)
        .send(updateSnippetObject).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(200);
      expect(res.body).toStrictEqual(updateSnippetObject);
    });
    it('Call with wrong id should return a 400', async () => {
      await supertest(app.getHttpServer()).put('/snippets/tata')
      .send(updateSnippetObject).set('Content-Type', 'application/json').set('Accept', 'application/json')
      .expect(400);
    });
    it('Call without entity should return a 400', async () => {
      await supertest(app.getHttpServer()).put('/snippets/' + validObjectId)
      .set('Content-Type', 'application/json').set('Accept', 'application/json')
      .expect(400);
    });
    it('Call with a wrong entity should return a 400', async () => {
      let wrongUpdateSnippet = updateSnippetObject;
      wrongUpdateSnippet.name = '';
      await supertest(app.getHttpServer()).put('/snippets/' + validObjectId)
        .send(wrongUpdateSnippet).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(400);
    });
    mock.mockClear();
  });

  describe('addSnippetNotation tests cases', () => {
    const mock = jest.spyOn(snippetsService, 'addSnippetNotation');
    mock.mockImplementation((id:string, notation:number) => { 
      return new Promise((resolve, reject) => { 
        resolve()
      }); 
    });
    it('Call with a correct notation should return a 200', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/addnote/${validObjectId}?note=4`).expect(204);
    });
    it('Call without id should return a 404', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/addnote/?note=4`).expect(400);
    });
    it('Call with WRONG id should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/addnote/tata?note=4`).expect(400);
    });
    it('Call without notation should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/addnote/${validObjectId}`).expect(400);
    });
    it('Call with WRONG notation should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/addnote/${validObjectId}?note=100`).expect(400);
    });
    mock.mockClear();
  });

  describe('addSnippetRelevance tests cases', () => {
    const mock = jest.spyOn(snippetsService, 'addSnippetRelevance');
    mock.mockImplementation((id:string, relevance:number) => { 
      return new Promise((resolve, reject) => { 
        resolve()
      }); 
    });
    it('Call with a correct notation should return a 200', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/addrelevance/${validObjectId}?relevance=4`).expect(204);
    });
    it('Call without id should return a 404', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/addrelevance/?relevance=4`).expect(400);
    });
    it('Call with WRONG id should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/addrelevance/tata?relevance=4`).expect(400);
    });
    it('Call without notation should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/addrelevance/${validObjectId}`).expect(400);
    });
    it('Call with WRONG notation should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/addrelevance/${validObjectId}?relevance=100`).expect(400);
    });
    mock.mockClear();
  });

  describe('updateSnippetStatus tests cases', () => {
    const mock = jest.spyOn(snippetsService, 'updateSnippetStatus');
    mock.mockImplementation((id:string, status:snippetStatusList) => { 
      return new Promise((resolve, reject) => { 
        resolve()
      }); 
    });
    it('Call with a correct Status should return a 200', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/updatestatus/${validObjectId}?status=${snippetStatusList.Private}`).expect(204);
    });
    it('Call without id should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/updatestatus/?status=${snippetStatusList.Private}`).expect(400);
    });
    it('Call with WRONG id should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/updatestatus/tata?status=${snippetStatusList.Private}`).expect(400);
    });
    it('Call without Status should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/updatestatus/${validObjectId}`).expect(400);
    });
    it('Call with WRONG Status should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/snippets/updatestatus/${validObjectId}?status=titi`).expect(400);
    });
    mock.mockClear();
  });

  describe('addSnippetComment tests cases', () => {
    const mock = jest.spyOn(snippetsService, 'addSnippetComment');
    mock.mockImplementation((id:string, comment:AddSnippetComment) => { 
      return new Promise((resolve, reject) => { 
        resolve(snippetCommentObject);
      }); 
    });
    it('Call with a correct Comment should return a 201', async () => {
      let res = await supertest(app.getHttpServer()).post(`/snippets/${validObjectId}/addcomment`)
        .send(addSnippetCommentObject).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(201);
      expect(res.body.id).toStrictEqual(snippetCommentObject.id);
    });
    it('Call without id should return a 404', async () => {
      await supertest(app.getHttpServer()).post(`/snippets//addcomment`)
        .send(addSnippetCommentObject).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(404);
    });
    it('Call with WRONG id should return a 400', async () => {
      await supertest(app.getHttpServer()).post(`/snippets/toto/addcomment`)
        .send(addSnippetCommentObject).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(400);
    });
    it('Call without Comment should return a 400', async () => {
      await supertest(app.getHttpServer()).post(`/snippets/${validObjectId}/addcomment`)
        .set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(400);
    });
    it('Call with WRONG Comment should return a 400', async () => {
      let wrongComment = addSnippetCommentObject;
      wrongComment.comment = '';
      await supertest(app.getHttpServer()).post(`/snippets/${validObjectId}/addcomment`)
        .send(wrongComment).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(400);
    });
    mock.mockClear();
  });

  describe('deleteSnippetComment tests cases', () => {
    const mock = jest.spyOn(snippetsService, 'deleteSnippetComment');
    mock.mockImplementation((id:string, idComment:string) => { 
      return new Promise((resolve, reject) => { 
        resolve();
      }); 
    });
    it('Call with a correct Comment should return a 200', async () => {
      await supertest(app.getHttpServer()).delete(`/snippets/${validObjectId}/comment/${validObjectId}`).expect(204);
    });
    it('Call without id should return a 400', async () => {
      await supertest(app.getHttpServer()).delete(`/snippets/${validObjectId}/comment/`).expect(404);
    });
    it('Call with WRONG id should return a 400', async () => {
      await supertest(app.getHttpServer()).delete(`/snippets/${validObjectId}/comment/toto`).expect(400);
    });
    mock.mockClear();
  });

  describe('deleteSnippet tests cases', () => {
    const mock = jest.spyOn(snippetsService, 'deleteSnippet');
    mock.mockImplementation((id:string) => { 
      return new Promise((resolve, reject) => { 
        resolve();
      }); 
    });
    it('Call with a correct Comment should return a 200', async () => {
      await supertest(app.getHttpServer()).delete(`/snippets/${validObjectId}`).expect(204);
    });
    it('Call without id should return a 400', async () => {
      await supertest(app.getHttpServer()).delete(`/snippets/`).expect(404);
    });
    it('Call with WRONG id should return a 400', async () => {
      await supertest(app.getHttpServer()).delete(`/snippets/toto`).expect(400);
    });
    mock.mockClear();
  });
});

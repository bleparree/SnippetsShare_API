import { Test, TestingModule } from '@nestjs/testing';
import { SnippetsController } from './snippets.controller';
import { SnippetsService } from './snippets.service';
import { INestApplication } from '@nestjs/common';
import { Snippet } from './entities/snippet.entity';
import { ObjectId } from 'mongodb';
import { snippetStatusList } from 'src/resources/entities/snippetStatusList.entity';

describe('SnippetsController', () => {
  let controller: SnippetsController;
  let app: INestApplication;
  let snippetsService = new SnippetsService(null);
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
    .overrideProvider(snippetsService).useValue(snippetsService)
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
    // it('Call should return a 200', async () => {});
  });

  describe('getSnippets tests cases', () => {
    // it('', async () => {});
  });

  describe('addSnippet tests cases', () => {
    // it('', async () => {});
  });

  describe('updateSnippet tests cases', () => {
    // it('', async () => {});
  });

  describe('addSnippetNotation tests cases', () => {
    // it('', async () => {});
  });

  describe('addSnippetRelevance tests cases', () => {
    // it('', async () => {});
  });

  describe('updateSnippetStatus tests cases', () => {
    // it('', async () => {});
  });

  describe('addSnippetComment tests cases', () => {
    // it('', async () => {});
  });

  describe('deleteSnippetComment tests cases', () => {
    // it('', async () => {});
  });

  describe('deleteSnippet tests cases', () => {
    // it('', async () => {});
  });
});

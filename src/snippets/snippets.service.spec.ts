import { Test, TestingModule } from '@nestjs/testing';
import { SnippetsService } from './snippets.service';
import { ObjectId } from 'mongodb';
import { snippetStatusList } from 'src/resources/entities/snippetStatusList.entity';
import { NotFoundException } from '@nestjs/common';
import { Snippet } from './entities/snippet.entity';
import { SnippetMock } from 'src/resources/mock/snippet-mock';
import { MongodbModule } from 'src/mongodb.module';
import { AddSnippet } from './dto/addSnippet.dto';
import { UpdateSnippet } from './dto/updateSnippet.dto';
import { AddSnippetComment } from './dto/addSnippetComment.dto';

describe('SnippetsService', () => {
  let service: SnippetsService;
  const mockSnippetList = (new SnippetMock()).fullList;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongodbModule],
      providers: [
        SnippetsService,
      ],
    }).compile();

    service = module.get<SnippetsService>(SnippetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('Test to get an existing snippet', async () => {
      let res:Snippet = await service.getSnippet(mockSnippetList[0]._id.toString())
      expect(res).toStrictEqual(new Snippet(mockSnippetList[0]));
    });
    it('Test to get an non existent snippet', async () => {
      try {
        let res = await service.getSnippet(new ObjectId().toString());
        expect(res).toBeNull()
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('getUsers', () => {
    it('Test to get the entire list without filter', async () => {
      let res = await service.getSnippets(50, 0);
      expect(res).toStrictEqual(mockSnippetList.map(val => new Snippet(val)));
    });
    it('Test to get the list filtered by a name', async () => {
      let searchText = 'snip';
      let res = await service.getSnippets(50, 0, searchText);
      expect(res).toStrictEqual(
        mockSnippetList.filter(val => val.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0  || 
                                    val.description.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
                                    val.searchKeywords.findIndex(v => (v.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0)) >= 0
                                  ).map(val => new Snippet(val)));
    });
    it('Test to get the list filtered by a desc', async () => {
      let searchText = 'desc 1';
      let res = await service.getSnippets(50, 0, searchText);
      expect(res).toStrictEqual(
        mockSnippetList.filter(val => val.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0  || 
                                    val.description.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
                                    val.searchKeywords.findIndex(v => (v.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0)) >= 0
                                  ).map(val => new Snippet(val)));
    });
    it('Test to get the list filtered by a searchKeyword & name', async () => {
      let searchText = 'LIste';
      let res = await service.getSnippets(50, 0, searchText);
      expect(res).toStrictEqual(
        mockSnippetList.filter(val => val.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0  || 
                                    val.description.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
                                    val.searchKeywords.findIndex(v => (v.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0)) >= 0
                                  ).map(val => new Snippet(val)));
    });
    it('Test to get the list filtered by codeLabelId', async () => {
      let res = await service.getSnippets(50, 0, null, mockSnippetList[0].codeLabelId);
      expect(res).toStrictEqual(mockSnippetList.filter(val => val.codeLabelId == mockSnippetList[0].codeLabelId).map(val => new Snippet(val)));
    });
    it('Test to get the list filtered by repositoryLabelId', async () => {
      let res = await service.getSnippets(50, 0, null, null, mockSnippetList[0].repositoryLabelId);
      expect(res).toStrictEqual(mockSnippetList.filter(val => val.repositoryLabelId == mockSnippetList[0].repositoryLabelId).map(val => new Snippet(val)));
    });
    it('Test to get the list filtered by freeLabels', async () => {
      let res = await service.getSnippets(50, 0, null, null, null, ['lab1', 'lab4']);
      expect(res).toStrictEqual(mockSnippetList.filter(val => val.freeLabels.includes('lab1') && val.freeLabels.includes('lab4')).map(val => new Snippet(val)));
    });
    it('Test to get the list filtered by relevance', async () => {
      let relevance = 4;
      let res = await service.getSnippets(50, 0, null, null, null, null, relevance);
      expect(res).toStrictEqual(mockSnippetList.filter(val => val.relevanceRank.averageNotation >= relevance && val.relevanceRank.averageNotation < relevance + 1).map(val => new Snippet(val)));
    });
    it('Test to get the list filtered by notation', async () => {
      let notation = 2;
      let res = await service.getSnippets(50, 0, null, null, null, null, null, notation);
      expect(res).toStrictEqual(mockSnippetList.filter(val => val.relevanceRank.averageNotation >= notation && val.relevanceRank.averageNotation < notation + 1).map(val => new Snippet(val)));
    });
    it('Test to get the list filtered by status', async () => {
      let res = await service.getSnippets(50, 0, null, null, null, null, null, null, snippetStatusList.Private);
      expect(res).toStrictEqual(mockSnippetList.filter(val => val.status == snippetStatusList.Private).map(val => new Snippet(val)));
    });
    it('Test to get the list filtered by authorId', async () => {
      let res = await service.getSnippets(50, 0, null, null, null, null, null, null, null, mockSnippetList[0].authorId);
      expect(res).toStrictEqual(mockSnippetList.filter(val => val.authorId == mockSnippetList[0].authorId).map(val => new Snippet(val)));
    });
    it('Test to get the list with search=test and status=Private', async () => {
      let searchText = 'test';
      let res = await service.getSnippets(50, 0, searchText, null, null, null, null, null, snippetStatusList.Private, null);
      expect(res).toStrictEqual(mockSnippetList.filter(val => (val.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0  || 
        val.description.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
        val.searchKeywords.findIndex(v => (v.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0)) >= 0)
        && val.status == snippetStatusList.Private).map(val => new Snippet(val)));
    });
    it('Test to search something who don\'t exist', async () => {
      let searchText = 'something who dont exist';
      let res = await service.getSnippets(50, 0, searchText);
      expect(res).toStrictEqual([]);
    });
  });

  describe('addSnippet', () => {
    it('Test to add a snippet', async () => {
      let add:AddSnippet = { name: 'Snippet 1', authorId: '663b79f193cdf9922e06aaa2', description: 'desc 1', status: snippetStatusList.Private, 
      codeLabelId: '663b79f193cdf9922e06aaa0', repositoryLabelId: '663b79f193cdf9922e06aaa1', freeLabels: ['lab1', 'lab2'], searchKeywords: ['code', 'Test'], 
      codeSections: [{ codeSection: 'My code Section', path: './', order: 1, type: 'C#' }]};
      let res = await service.addSnippet(add);
      expect(res).toBeDefined();
      expect(res.length).toBeGreaterThan(10);
    });
  });

  describe('updateSnippet', () => {
    it('Test to update a snippet', async () => {
      const toUpdate = mockSnippetList.find(res => res.name == 'Snippet 1');
      const newDescription = 'a looooong description';
      const newFreeLabels = toUpdate.freeLabels;
      newFreeLabels.push('lab5');
      let up:UpdateSnippet = { name: toUpdate.name, authorId: toUpdate.authorId, description: newDescription, status: toUpdate.status, 
        codeLabelId: toUpdate.codeLabelId, repositoryLabelId: toUpdate.repositoryLabelId, freeLabels: newFreeLabels, searchKeywords: toUpdate.searchKeywords, 
        codeSections: toUpdate.codeSections};
      let res:UpdateSnippet = await service.updateSnippet(toUpdate._id.toString(), up);
      expect(res).toBeDefined();
      expect(res.name).toBe(toUpdate.name);
      expect(res.description).toBe(newDescription);
      expect(res.freeLabels).toBe(newFreeLabels);
    });
    it('Test to update an unknowId', async () => {
      const toUpdate = mockSnippetList.find(res => res.name == 'Snippet 1');
      const newDescription = 'a looooong description';
      const newFreeLabels = toUpdate.freeLabels;
      newFreeLabels.push('lab5');
      let up:UpdateSnippet = { name: toUpdate.name, authorId: toUpdate.authorId, description: newDescription, status: toUpdate.status, 
        codeLabelId: toUpdate.codeLabelId, repositoryLabelId: toUpdate.repositoryLabelId, freeLabels: newFreeLabels, searchKeywords: toUpdate.searchKeywords, 
        codeSections: toUpdate.codeSections};
      try {
        await service.updateSnippet(new ObjectId().toString(), up);
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('addSnippetNotation', () => {
    it('Test to add a notation to a snippet', async () => {
      await service.addSnippetNotation(mockSnippetList[0]._id.toString(), 3);

      const res:Snippet = await service.getSnippet(mockSnippetList[0]._id.toString());
      expect(res.id).toBe(mockSnippetList[0]._id.toString());
      expect(res.solutionNotation.averageNotation).not.toBe(mockSnippetList[0].solutionNotation.averageNotation);
      expect(res.solutionNotation.count).toBe(mockSnippetList[0].solutionNotation.count + 1);
    });
    it('Test to add a notation to an unknow id', async () => {
      try {
        await service.addSnippetNotation(new ObjectId().toString(), 3);
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('addSnippetRelevance', () => {
    it('Test to add a relevance to a snippet', async () => {
      await service.addSnippetRelevance(mockSnippetList[0]._id.toString(), 3);

      const res:Snippet = await service.getSnippet(mockSnippetList[0]._id.toString());
      expect(res.id).toBe(mockSnippetList[0]._id.toString());
      expect(res.relevanceRank.averageNotation).not.toBe(mockSnippetList[0].relevanceRank.averageNotation);
      expect(res.relevanceRank.count).toBe(mockSnippetList[0].relevanceRank.count + 1);
    });
    it('Test to add a relevance to an unknow id', async () => {
      try {
        await service.addSnippetRelevance(new ObjectId().toString(), 3);
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('updateSnippetStatus', () => {
    it('Test to update the snippet status', async () => {
      await service.updateSnippetStatus(mockSnippetList[0]._id.toString(), snippetStatusList.Public);
      
      let snip:Snippet = await service.getSnippet(mockSnippetList[0]._id.toString());
      expect(snip).toBeDefined();
      expect(snip.id).toBe(mockSnippetList[0]._id.toString());
      expect(snip.status).toBe(snippetStatusList.Public);
    });
    it('Test to update an unknow id', async () => {
      try {
        await service.updateSnippetStatus((new ObjectId()).toString(), snippetStatusList.Public);
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('addSnippetComment', () => {
    it('Test to add a comment to a snippet', async () => {
      const dtoAddComment:AddSnippetComment = { comment: 'my added comment', authorId: new ObjectId().toString() };
      await service.addSnippetComment(mockSnippetList[0]._id.toString(), dtoAddComment);
      
      let snip:Snippet = await service.getSnippet(mockSnippetList[0]._id.toString());
      expect(snip).toBeDefined();
      expect(snip.id).toBe(mockSnippetList[0]._id.toString());
      expect(snip.comments.length).toBeGreaterThan(mockSnippetList[0].comments.length);
      expect(snip.comments[snip.comments.length - 1].comment).toBe(dtoAddComment.comment);
    });
    it('Test to add comment to an unknow snippet id', async () => {
      try {
        const dtoAddComment:AddSnippetComment = { comment: 'my added comment', authorId: new ObjectId().toString() };
        await service.addSnippetComment((new ObjectId()).toString(), dtoAddComment);
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteSnippetComment', () => {
    it('Test to delete a snippet comment', async () => {
      let snip:Snippet = await service.getSnippet(mockSnippetList[0]._id.toString());
      await service.deleteSnippetComment(mockSnippetList[0]._id.toString(), snip.comments[0].id);
      
      snip = await service.getSnippet(mockSnippetList[0]._id.toString());
      expect(snip).toBeDefined();
      expect(snip.id).toBe(mockSnippetList[0]._id.toString());
      expect(snip.comments.length).toBe(0);
    });
    it('Test to delete unknow comment id from a knowed snippet', async () => {
      try {
        let snip:Snippet = await service.getSnippet(mockSnippetList[0]._id.toString());
        await service.deleteSnippetComment(snip.id, (new ObjectId()).toString());
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
    it('Test to delete comment to an unknow snippet id', async () => {
      try {
        await service.deleteSnippetComment((new ObjectId()).toString(), (new ObjectId()).toString());
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteSnippet', () => {
    it('Test to delete a snippet', async () => {
      await service.deleteSnippet(mockSnippetList[mockSnippetList.length-1]._id.toString());
      
      try {
        let res = await service.getSnippet(mockSnippetList[mockSnippetList.length-1]._id.toString());
        expect(res).toBeNull()
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
    it('Test to delete an unknow id', async () => {
      try {
        await service.deleteSnippet((new ObjectId()).toString());
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

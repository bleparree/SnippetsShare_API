import { HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Db, Document, Filter, InsertOneResult, ObjectId, UpdateResult, WithId } from 'mongodb';
import { Snippet } from './entities/snippet.entity';
import { snippetStatusList } from 'src/resources/entities/snippetStatusList.entity';
import { GetSnippets } from './dto/getSnippets.dto';
import { AddSnippet, AddSnippetForInsert } from './dto/addSnippet.dto';
import { UpdateSnippet } from './dto/updateSnippet.dto';
import { AddSnippetComment } from './dto/addSnippetComment.dto';
import { Snippet_comments } from './entities/snippet_comments.entity';
import { Snippet_notation } from './entities/snippet_notation.entity';

@Injectable()
export class SnippetsService {
  constructor(@Inject('MONGO_CLIENT') private readonly db: Db) {}
  collectionName:string = 'Snippets'

  /**
   * Mongo access to get a specific snippet
   * @param id Id of the snippet to return
   * @returns A complete snippet object
   */
  async getSnippet(id: string) : Promise<Snippet> {
    let filterDocument:Filter<Document> = { _id: new ObjectId(id) };

        try {
            let value: WithId<Document> = await this.db.collection(this.collectionName).findOne(filterDocument);
            if (!value) throw new NotFoundException('No Snippet can be found for id ' + id);
            
            return new Snippet(value);
        }
        catch (err) { 
            if (err instanceof HttpException) throw err;
            else throw new InternalServerErrorException(err); 
        };
  }

  /**
   * Mongo access to get all the snippets following a range of parameters
   * @param limit Number of result to return
   * @param offset Starting position of the result set to return
   * @param search Search word to search in name/description/searchkeywords
   * @param codeLabelId Code label Id to search into
   * @param repositoryLabelId Repository Label Id to search into
   * @param freeLabels FreeLabels Ids to search into
   * @param relevance Relevance of the snippets to search in
   * @param notation Notation of the snippets to search in
   * @param status Status of the snippet to search in
   * @param authorId Snippet Author Id to return
   * @returns A set of partial snippets
   */
  async getSnippets(
    limit: number,
    offset: number,
    search?: string,
    codeLabelId?: string,
    repositoryLabelId?: string,
    freeLabels?: string[],
    relevance?: number,
    notation?: number,
    status?: snippetStatusList,
    authorId?: string) : Promise<Array<GetSnippets>> {
    let filterDocument:Filter<Document> = {};
    let filterArray = [];

    const filterSearch = 
    { $or: [
        { 'name': { $regex: `^.*((?i)${search}).*$` }},
        { 'description': { $regex: `^.*((?i)${search}).*$` }},
        { 'searchKeywords': { $regex: `^.*((?i)${search}).*$` }}
    ]};
    
    if (search) filterArray.push(filterSearch);
    if (codeLabelId) filterArray.push({ 'codeLabelId': codeLabelId });
    if (repositoryLabelId) filterArray.push({ 'repositoryLabelId': repositoryLabelId });
    if (freeLabels) {
      freeLabels.forEach(fl => {
        filterArray.push({ 'freeLabels': fl });
      });
    }
    if (relevance) filterArray.push({ $and: [ { 'relevanceRank.averageNotation': {$gte: relevance} }, { 'relevanceRank.averageNotation': {$lt: relevance + 1} }] });
    if (notation) filterArray.push({ $and: [ { 'solutionNotation.averageNotation': {$gte: notation} }, { 'solutionNotation.averageNotation': {$lt: notation + 1} }] });
    if (status) filterArray.push({ 'status': status });
    if (authorId) filterArray.push({ 'authorId': authorId });

    if (filterArray.length > 1) filterDocument = { $and: filterArray } 
    else if (filterArray.length == 1) filterDocument = filterArray[0];

    try {
      let value: WithId<Document>[] = await this.db.collection(this.collectionName).find(filterDocument).limit(limit).skip(offset).toArray();
      if (value.length > 0) {
        return value.map(val => {
            return new Snippet(val);
        });
      }
      return [];
    }
    catch (err) { throw new InternalServerErrorException(err) };
  }

  /**
   * Mongo access to insert a new snippet
   * @param dto Snippet to in database
   * @returns The id of newly created snippet
   */
  async addSnippet(dto: AddSnippet) : Promise<string> {
    try {
      let objectToInsert:AddSnippetForInsert = new AddSnippetForInsert(dto);
      let value:InsertOneResult<Document> = await this.db.collection(this.collectionName).insertOne(objectToInsert);
      if (value.acknowledged) return value.insertedId.toString();
      else throw 'InsertOneResult acknowledged status is false';
    }
    catch (err) { throw new InternalServerErrorException(err) };
  }

  /**
   * Mongo access to update globaly an existing snippet
   * @param id Snippet Id to update
   * @param dto The updated object
   * @returns The modified object
   */
  async updateSnippet(id: string, dto: UpdateSnippet) : Promise<UpdateSnippet> {
    try {
      let value:UpdateResult<Document> = await this.db.collection(this.collectionName).updateOne({ _id: new ObjectId(id) }, { $set: dto })
      if (value.acknowledged && value.matchedCount == 1) {
          return dto;
      }
      else throw new NotFoundException('Cannot find any Snippet to update');
    }
    catch (err) { 
        if (err instanceof HttpException) throw err;
        else throw new InternalServerErrorException(err); 
    };
  }

  /**
   * Mongo access to update a snippet notation
   * @param id Id of the snippet to update
   * @param notation Notation of the snippet to add
   */
  async addSnippetNotation(id: string, notation: number) : Promise<void> {
    try {
      const snippet:Snippet = await this.getSnippet(id);
      const oldCount = snippet.solutionNotation.count;
      const newCount = snippet.solutionNotation.count + 1;
      const oldNote = snippet.solutionNotation.averageNotation;
      const newNote = ((oldNote * oldCount) + notation) / (newCount);
      const newNotation:Snippet_notation = new Snippet_notation(newNote, newCount);
      const value:UpdateResult<Document> = await this.db.collection(this.collectionName).updateOne({ _id: new ObjectId(id) }, { $set: { 'solutionNotation': newNotation } });
      if (!(value.acknowledged && value.matchedCount == 1)) throw new NotFoundException('Cannot find any Snippet to update');
    }
    catch (err) { 
        if (err instanceof HttpException) throw err;
        else throw new InternalServerErrorException(err); 
    };
  }

  /**
   * Mongo access to update the relevance of a specific snippet
   * @param id Id of the snippet to update
   * @param relevance Relevance to add
   */
  async addSnippetRelevance(id: string, relevance: number) : Promise<void> {
    try {
      const snippet:Snippet = await this.getSnippet(id);
      const oldCount = snippet.relevanceRank.count;
      const newCount = snippet.relevanceRank.count + 1;
      const oldNote = snippet.relevanceRank.averageNotation;
      const newNote = ((oldNote * oldCount) + relevance) / (newCount);
      const newNotation:Snippet_notation = new Snippet_notation(newNote, newCount);
      const value:UpdateResult<Document> = await this.db.collection(this.collectionName).updateOne({ _id: new ObjectId(id) }, { $set: { 'relevanceRank': newNotation } });
      if (!(value.acknowledged && value.matchedCount == 1)) throw new NotFoundException('Cannot find any Snippet to update');
    }
    catch (err) { 
        if (err instanceof HttpException) throw err;
        else throw new InternalServerErrorException(err); 
    };
  }

  /**
   * Mongo access to update the status of a snippet
   * @param id Id of the snippet to update
   * @param status New snippet status
   */
  async updateSnippetStatus(id: string, status: snippetStatusList) : Promise<void> {

  }

  /**
   * Mongo access to add a snippet comment
   * @param id Id of the snippet to update
   * @param dto Comment Object to insert
   * @returns The complete inserted comment object
   */
  async addSnippetComment(id: string, dto: AddSnippetComment) : Promise<Snippet_comments> {
    return null;
  }

  /**
   * Mongo access to remove a comment from a snippet
   * @param id Id of the snippet to update
   * @param commentId Id of the comment to delete
   */
  async deleteSnippetComment(id: string, commentId: string) : Promise<void> {

  }

  /**
   * Mongo access of the snippet to delete
   * @param id Id of the snippet to delete
   */
  async deleteSnippet(id: string) : Promise<void> {

  }
}

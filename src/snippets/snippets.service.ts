import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { Snippet } from './entities/snippet.entity';
import { snippetStatusList } from 'src/resources/entities/snippetStatusList.entity';
import { GetSnippets } from './dto/getSnippets.dto';
import { AddSnippet } from './dto/addSnippet.dto';
import { UpdateSnippet } from './dto/updateSnippet.dto';
import { AddSnippetComment } from './dto/addSnippetComment.dto';
import { Snippet_comments } from './entities/snippet_comments.entity';

@Injectable()
export class SnippetsService {
  constructor(@Inject('MONGO_CLIENT') private readonly db: Db) {}

  async getSnippet(id: string) : Promise<Snippet> {
    return null;
  }

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
    return null;
  }

  async addSnippet(dto: AddSnippet) : Promise<string> {
    return null;
  }

  async updateSnippet(id: string, dto: UpdateSnippet) : Promise<UpdateSnippet> {
    return null;
  }

  async addSnippetNotation(id: string, notation: number) : Promise<void> {
  }

  async addSnippetRelevance(id: string, relevance: number) : Promise<void> {

  }

  async updateSnippetStatus(id: string, status: snippetStatusList) : Promise<void> {

  }

  async addSnippetComment(id: string, dto: AddSnippetComment) : Promise<Snippet_comments> {
    return null;
  }

  async deleteSnippetComment(id: string, commentId: string) : Promise<void> {

  }

  async deleteSnippet(id: string) : Promise<void> {

  }
}

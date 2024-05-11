import { Body, Controller, Delete, Get, HttpCode, Param, ParseEnumPipe, ParseFloatPipe, ParseIntPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { ApiBadRequestResponse, ApiBody, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Snippet } from './entities/snippet.entity';
import { MongoIdValidationPipe } from 'src/resources/pipes/mongoIdValidationPipe.pipe';
import { GetSnippets } from './dto/getSnippets.dto';
import { snippetStatusList } from 'src/resources/entities/snippetStatusList.entity';
import { AddSnippet } from './dto/addSnippet.dto';
import { UpdateSnippet } from './dto/updateSnippet.dto';
import { NotationValidationPipe } from './entities/snippet_notation.entity';
import { AddSnippetComment } from './dto/addSnippetComment.dto';
import { Snippet_comments } from './entities/snippet_comments.entity';

@ApiTags('Snippets')
@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get a complete Snippet' })
  @ApiParam({ name:'id', description: 'Id of the requested snippet', required: true })
  @ApiOkResponse({ type: Snippet })
  @ApiNotFoundResponse({ description: 'If unable to find the snippet id' })
  @ApiBadRequestResponse({description: 'If id wrongly composed'})
  getSnippet(@Param('id', new MongoIdValidationPipe()) id:string) : Promise<Snippet> {
    return this.snippetsService.getSnippet(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of snippet filtered among severals criterias' })
  @ApiQuery({ name:'search', description: 'Word or sentence to filter among the snippets (search in name/description/keywords)', required: false })
  @ApiQuery({ name:'codeLabelId', description: 'Filter snippet with a codeLabel', required: false })
  @ApiQuery({ name:'repositoryLabelId', description: 'Filter snippet with a RepositoryLabel', required: false })
  @ApiQuery({ name:'freeLabels', description: 'Filter snippet with a list of freeLabels', required: false, type:String, isArray: true })
  @ApiQuery({ name:'relevance', description: 'Filter snippet of aspecific relevance (3 filter between 3 and 4)', required: false })
  @ApiQuery({ name:'notation', description: 'Filter snippet of a specific notation (3 filter between 3 and 4)', required: false })
  @ApiQuery({ name:'status', description: 'Filter public or private snippets', required: false, enum: snippetStatusList })
  @ApiQuery({ name:'authorId', description: 'Filter snippets of a specific author', required: false })
  @ApiQuery({ name:'limit', description: 'Limit the number of response by (50 by default)', required: false,  })
  @ApiQuery({ name:'offset', description: 'Start to grab the response starting to xx', required: false })
  @ApiOkResponse({ type: [GetSnippets] })
  @ApiBadRequestResponse({description: 'If one of the query parameter wrongly composed'})
  getSnippets(
    @Query('search') search?: string, 
    @Query('codeLabelId') codeLabelId?: string,
    @Query('repositoryLabelId') repositoryLabelId?: string,
    @Query('freeLabels') freeLabels?: string[],
    @Query('relevance', new ParseIntPipe({optional: true})) relevance?: number,
    @Query('notation', new ParseIntPipe({optional: true})) notation?: number,
    @Query('status', new ParseEnumPipe(snippetStatusList, {optional:true})) status?: snippetStatusList,
    @Query('authorId') authorId?: string,
    @Query('limit', new ParseIntPipe({optional: true})) limit: number = 50,
    @Query('offset', new ParseIntPipe({optional: true})) offset: number = 0) : Promise<Array<GetSnippets>> {
      return this.snippetsService.getSnippets(limit, offset, search, codeLabelId, repositoryLabelId, freeLabels, relevance, notation, status, authorId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new snippet' })
  @ApiBody({ required: true, type: AddSnippet} )
  @ApiOkResponse({ description:'Return the generated Id of the new element', type: String })
  @ApiBadRequestResponse({description: 'If entity wrongly composed'})
  addSnippet(@Body(new ValidationPipe({expectedType:AddSnippet, whitelist: true, forbidNonWhitelisted: true})) entity: AddSnippet) : Promise<string> {
    return this.snippetsService.addSnippet(entity);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a complete snippet' })
  @ApiParam({ name:'id', description: 'Id of the snippet to update', required: true })
  @ApiBody({ type: UpdateSnippet, required: true })
  @ApiOkResponse({ description:'Return the update object', type: UpdateSnippet })
  @ApiNotFoundResponse({ description: 'If unable to find the snippet id' })
  @ApiBadRequestResponse({description: 'If id or entity wrongly composed'})
  updateSnippet(@Param('id', new MongoIdValidationPipe()) id:string, @Body(new ValidationPipe({expectedType:UpdateSnippet, whitelist: true, forbidNonWhitelisted: true})) entity: UpdateSnippet) : Promise<UpdateSnippet> {
    return this.snippetsService.updateSnippet(id, entity);
  }

  @Put('/:id/addnote')
  @ApiOperation({ summary: 'Add a notation to a snippet' })
  @ApiParam({ name:'id', description: 'Id of the snippet to update', required: true })
  @ApiQuery({ name: 'note', description: 'Notation from 1 to 5', required: true})
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'If unable to find the snippet id' })
  @ApiBadRequestResponse({description: 'If id wrongly composed or if note is not a number between 1 and 5'})
  addSnippetNotation(@Param('id', new MongoIdValidationPipe()) id:string, @Query('note', new NotationValidationPipe()) note:number) : Promise<void> {
    return this.snippetsService.addSnippetNotation(id, note);
  }

  @Put('/:id/addrelevance')
  @ApiOperation({ summary: 'Add a relevance to a snippet' })
  @ApiParam({ name:'id', description: 'Id of the snippet to update', required: true })
  @ApiQuery({ name: 'relevance', description: 'Notation from 1 to 5', required: true})
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'If unable to find the snippet id' })
  @ApiBadRequestResponse({description: 'If id wrongly composed or if relevance is not a number between 1 and 5'})
  addSnippetRelevance(@Param('id', new MongoIdValidationPipe()) id:string, @Query('relevance', new NotationValidationPipe()) relevance:number) : Promise<void> {
    return this.snippetsService.addSnippetRelevance(id, relevance);
  }

  @Put('/:id/updatestatus')
  @ApiOperation({ summary: 'Update the status of a snippet' })
  @ApiParam({ name:'id', description: 'Id of the snippet to update', required: true })
  @ApiQuery({ name: 'status', description: 'Status (Private or Public)', required: true, enum: snippetStatusList})
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'If unable to find the snippet id' })
  @ApiBadRequestResponse({description: 'If id or status wrongly composed'})
  updateSnippetStatus(@Param('id', new MongoIdValidationPipe()) id:string, @Query('status', new ParseEnumPipe(snippetStatusList)) status:snippetStatusList) : Promise<void> {
    return this.snippetsService.updateSnippetStatus(id, status);
  }

  @Post('/:id/addcomment')
  @ApiOperation({ summary: 'Add a new comment to a snippet'})
  @ApiParam({ name:'id', description: 'Id of the snippet to update', required: true })
  @ApiBody({ description:'New comment for the snippet', required:true, type: AddSnippetComment})
  @ApiOkResponse({description: 'If insert success, return the full new comment object', type:Snippet_comments})
  @ApiNotFoundResponse({description: 'If unable to find the snippet Id'})
  @ApiBadRequestResponse({description: 'If id or snippetComment wrongly composed'})
  addSnippetComment(@Param('id', new MongoIdValidationPipe()) id:string, @Body(new ValidationPipe({expectedType: AddSnippetComment, whitelist: true, forbidNonWhitelisted: true})) comment:AddSnippetComment) : Promise<Snippet_comments> {
    return this.snippetsService.addSnippetComment(id, comment);
  }

  @Delete('/:id/comment/:commentId')
  @ApiOperation({ summary: 'Delete a snippet comment' })
  @ApiParam({ name:'id', description: 'Id of the snippet to delete', required: true })
  @ApiParam({ name:'commentId', description: 'Id of the comment to delete', required: true })
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({description: 'If unable to find the snippet Id or the commentId'})
  @ApiBadRequestResponse({description: 'If id or commentId wrongly composed'})
  async deleteSnippetComment(@Param('id', new MongoIdValidationPipe()) id:string, @Param('commentId', new MongoIdValidationPipe()) commentId:string): Promise<void> {
    await this.snippetsService.deleteSnippetComment(id, commentId);
  }
  
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a snippet' })
  @ApiParam({ name:'id', description: 'Id of the snippet to delete', required: true })
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({description: 'If unable to find the snippet Id'})
  @ApiBadRequestResponse({description: 'If id wrongly composed'})
  async deleteSnippet(@Param('id', new MongoIdValidationPipe()) id:string): Promise<void> {
    await this.snippetsService.deleteSnippet(id);
  }
}

import { Body, Controller, Delete, Get, HttpCode, Param, ParseEnumPipe, ParseFloatPipe, ParseIntPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Snippet } from './entities/snippet.entity';
import { MongoIdValidationPipe } from 'src/resources/pipes/mongoIdValidationPipe.pipe';
import { GetSnippets } from './dto/getSnippets.dto';
import { snippetStatusList } from 'src/resources/entities/snippetStatusList.entity';
import { AddSnippet } from './dto/addSnippet.dto';
import { UpdateSnippet } from './dto/updateSnippet.dto';
import { NotationValidationPipe } from './entities/snippet_notation.entity';

@ApiTags('snippets')
@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get a complete Snippet' })
  @ApiParam({ name:'id', description: 'Id of the requested snippet', required: true })
  @ApiOkResponse({ type: Snippet })
  @ApiNotFoundResponse({ description: 'If unable to find the snippet id' })
  getSnippet(@Param('id', new MongoIdValidationPipe()) id:string) : Promise<Snippet> {
    return null;
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of snippet filtered among severals criterias' })
  @ApiQuery({ name:'search', description: 'Word or sentence to filter among the snippets (search in name/description/keywords)', required: false })
  @ApiQuery({ name:'codeLabelId', description: 'Filter snippet with a codeLabel', required: false })
  @ApiQuery({ name:'repositoryLabelId', description: 'Filter snippet with a RepositoryLabel', required: false })
  @ApiQuery({ name:'freeLabels', description: 'Filter snippet with a list of freeLabels', required: false })
  @ApiQuery({ name:'relevance', description: 'Filter snippet of aspecific relevance (3 filter between 3 and 4)', required: false })
  @ApiQuery({ name:'notation', description: 'Filter snippet of a specific notation (3 filter between 3 and 4)', required: false })
  @ApiQuery({ name:'status', description: 'Filter public or private snippets', required: false })
  @ApiQuery({ name:'authorId', description: 'Filter snippets of a specific author', required: false })
  @ApiQuery({ name:'limit', description: 'Limit the number of response by (50 by default)', required: false })
  @ApiQuery({ name:'offset', description: 'Start to grab the response starting to xx', required: false })
  @ApiOkResponse({ type: [GetSnippets] })
  getSnippets(
    @Query('search') search?: string, 
    @Query('codeLabelId') codeLabelId?: string,
    @Query('repositoryLabelId') repositoryLabelId?: string,
    @Query('freeLabels') freeLabels?: string[],
    @Query('relevance') relevance?: number,
    @Query('notation') notation?: number,
    @Query('status', new ParseEnumPipe(snippetStatusList, {optional:true})) status?: snippetStatusList,
    @Query('authorId') authorId?: string,
    @Query('limit') limit?: number, //TODO default Value
    @Query('offset') offset?: number) : Promise<Array<GetSnippets>> {
      return null;
      //TODO Add the limit / offset to the getuser list
  }

  @Post()
  @ApiOperation({ summary: 'Add a new snippet' })
  @ApiBody({ required: true, type: AddSnippet} )
  @ApiOkResponse({ description:'Return the generated Id of the new element', type: String })
  addSnippet(@Body(new ValidationPipe({expectedType:AddSnippet})) entity: AddSnippet) : Promise<string> {
    return null;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a complete snippet' })
  @ApiParam({ name:'id', description: 'Id of the snippet to update', required: true })
  @ApiBody({ type: UpdateSnippet, required: true })
  @ApiOkResponse({ description:'Return the update object', type: UpdateSnippet })
  @ApiNotFoundResponse({ description: 'If unable to find the snippet id' })
  updateSnippet(@Param('id', new MongoIdValidationPipe()) id:string, @Body(new ValidationPipe({expectedType:UpdateSnippet})) entity: UpdateSnippet) : Promise<UpdateSnippet> {
    return null;
  }

  @Put('/addnote/:id')
  @ApiOperation({ summary: 'Add a notation to a snippet' })
  @ApiParam({ name:'id', description: 'Id of the snippet to update', required: true })
  @ApiQuery({ name: 'note', description: 'Notation from 1 to 5', required: true})
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the snippet id' })
  addSnippetNotation(@Param('id', new MongoIdValidationPipe()) id:string, @Query('note', new NotationValidationPipe()) note:number) : Promise<void> {
    return null;
  }

  @Put('/addrelevance/:id')
  @ApiOperation({ summary: 'Add a relevance to a snippet' })
  @ApiParam({ name:'id', description: 'Id of the snippet to update', required: true })
  @ApiQuery({ name: 'relevance', description: 'Notation from 1 to 5', required: true})
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the snippet id' })
  addSnippetRelevance(@Param('id', new MongoIdValidationPipe()) id:string, @Query('relevance', new NotationValidationPipe()) relevance:number) : Promise<void> {
    return null;
  }

  @Put('/updatestatus/:id')
  @ApiOperation({ summary: 'Update the status of a snippet' })
  @ApiParam({ name:'id', description: 'Id of the snippet to update', required: true })
  @ApiQuery({ name: 'status', description: 'Status (Private or Public)', required: true, enum: snippetStatusList})
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the snippet id' })
  updateSnippetStatus(@Param('id', new MongoIdValidationPipe()) id:string, @Query('status', new ParseEnumPipe(snippetStatusList)) status:snippetStatusList) : Promise<void> {
    return null;
  }

  //addSnippetComment

  //deleteSnippetComment
  
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a snippet' })
  @ApiParam({ name:'id', description: 'Id of the snippet to delete', required: true })
  @HttpCode(204)
  async deleteRestrictedLabel(@Param('id', new MongoIdValidationPipe()) id:string): Promise<void> {
    // await this.restrictedLabelsService.deleteRestrictedLabel(id);
  }
}

import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseEnumPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { RestrictedLabelsService } from './restricted-labels.service';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { updateRestrictedLabel } from './dto/updateRestrictedLabel.dto';
import { ApiBadRequestResponse, ApiBody, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { addRestrictedLabel } from './dto/addRestrictedLabel.dto';
import { typeList } from 'src/resources/entities/typeList.entity';
import { MongoIdValidationPipe } from 'src/resources/pipes/mongoIdValidationPipe.pipe';

@ApiTags('RestrictedLabels')
@Controller('restricted-labels')
export class RestrictedLabelsController {
  constructor(private readonly restrictedLabelsService: RestrictedLabelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get All the restricted labels' })
  @ApiQuery({ name:'name', description: 'Filter restricted label based on a partial name', required: false })
  @ApiQuery({ name:'type', description: 'Filter among a predefined list of restricted label types', required: false, enum: typeList })
  @ApiOkResponse({ type: [RestrictedLabel] })
  @ApiBadRequestResponse({description: 'If type query param is wrongly composed'})
  getRestrictedLabels(@Query('name') name?: string, @Query('type', new ParseEnumPipe(typeList, {optional:true})) type?: typeList) : Promise<Array<RestrictedLabel>> {
    return this.restrictedLabelsService.getRestrictedLabels(name, type);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new restricted labels (admin Only)' })
  @ApiBody({ required: true, type: addRestrictedLabel} )
  @ApiOkResponse({ description:'Return the generated Id of the new element', type: String })
  @ApiBadRequestResponse({description: 'If body content wrongly composed'})
  addRestrictedLabel(@Body(new ValidationPipe({expectedType:addRestrictedLabel, whitelist: true, forbidNonWhitelisted: true})) entity: addRestrictedLabel) : Promise<string> {
    return this.restrictedLabelsService.addRestrictedLabel(entity);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a restricted label name (admin only)' })
  @ApiParam({ name:'id', description: 'Id of the Restricted label to update', required: true })
  @ApiQuery({ name:'name', description: 'Updated name of the Restricted label to update', required: true })
  @ApiOkResponse({ description:'Return the update object', type: updateRestrictedLabel })
  @ApiBadRequestResponse({description: 'If id wrongly composed'})
  @ApiNotFoundResponse({ description: 'If unable to find the RestrictedLabel id' })
  updateRestrictedLabel(@Param('id', new MongoIdValidationPipe()) id:string, @Query('name') name: string) : Promise<updateRestrictedLabel> {
    if (name == null || name.length == 0) { throw new BadRequestException('Name Parameter is required'); }
    return this.restrictedLabelsService.updateRestrictedLabel(id, name);
  }
  
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a restricted labels (admin only)' })
  @ApiParam({ name:'id', description: 'Id of the Restricted label to delete', required: true })
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiBadRequestResponse({description: 'If id wrongly composed'})
  @ApiNotFoundResponse({ description: 'If unable to find the RestrictedLabel id' })
  async deleteRestrictedLabel(@Param('id', new MongoIdValidationPipe()) id:string): Promise<void> {
    await this.restrictedLabelsService.deleteRestrictedLabel(id);
  }
}

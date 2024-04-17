import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { RestrictedLabelsService } from './restricted-labels.service';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { updateRestrictedLabel } from './dto/updateRestrictedLabel.dto';
import { ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { addRestrictedLabel } from './dto/addRestrictedLabel.dto';

@ApiTags('RestrictedLabels')
@Controller('restricted-labels')
export class RestrictedLabelsController {
  constructor(private readonly restrictedLabelsService: RestrictedLabelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get All the restricted labels' })
  @ApiQuery({ name:'name', description: 'Filter restricted label based on a partial name', required: false })
  @ApiQuery({ name:'type', description: 'Filter among a predefined list of restricted label types', required: false })
  @ApiOkResponse({ type: [RestrictedLabel] })
  getRestrictedLabels(@Query('name') name?: string, @Query('type') type?: string) : Promise<Array<RestrictedLabel>> {
    return this.restrictedLabelsService.getRestrictedLabels(name, type);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new restricted labels (admin Only)' })
  @ApiBody({ required: true} )
  @ApiOkResponse({ description:'Return the generated Id of the new element', type: String })
  addRestrictedLabel(@Body(new ValidationPipe({expectedType:addRestrictedLabel})) entity: addRestrictedLabel) : Promise<string> {
    return this.restrictedLabelsService.addRestrictedLabel(entity);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a restricted label name (admin only)' })
  @ApiParam({ name:'id', description: 'Id of the Restricted label to update', required: true })
  @ApiQuery({ name:'name', description: 'Updated name of the Restricted label to update', required: true })
  @ApiOkResponse({ description:'Return the update object', type: updateRestrictedLabel })
  updateRestrictedLabel(@Param('id') id:string, @Query('name') name: string) : Promise<updateRestrictedLabel> {
    if (name == null || name.length == 0) { throw new BadRequestException('Name Parameter is required'); }
    return this.restrictedLabelsService.updateRestrictedLabel(id, name);
  }
  
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a restricted labels (admin only)' })
  @ApiParam({ name:'id', description: 'Id of the Restricted label to delete', required: true })
  @HttpCode(204)
  async deleteRestrictedLabel(@Param('id') id:string): Promise<void> {
    await this.restrictedLabelsService.deleteRestrictedLabel(id);
  }

  @Get('/types')
  @ApiOperation({ summary: 'Get All the restricted labels types (enum)' })
  @ApiOkResponse({ description:'Return the complete list of RLabel Type', type: Array<String> })
  getRestrictedLabelTypes() : Array<string> {
    return this.restrictedLabelsService.getRestrictedLabelTypes();
  }
}

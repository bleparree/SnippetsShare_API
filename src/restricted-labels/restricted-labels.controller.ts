import { Body, Controller, Delete, Get, HttpCode, InternalServerErrorException, Param, Post, Put, Query } from '@nestjs/common';
import { RestrictedLabelsService } from './restricted-labels.service';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { updateRestrictedLabel } from './dto/updateRestrictedLabel.dto';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { addRestrictedLabel } from './dto/addRestrictedLabel.dto';

@ApiTags('RestrictedLabels')
@Controller('restricted-labels')
export class RestrictedLabelsController {
  constructor(private readonly restrictedLabelsService: RestrictedLabelsService) {}

  @ApiOperation({ summary: 'Get All the restricted labels' })
  @ApiQuery({ name:'name', description: 'Filter restricted label based on a partial name', required: false })
  @ApiQuery({ name:'type', description: 'Filter among a predefined list of restricted label types', required: false })
  @Get()
  @ApiOkResponse({ type: [RestrictedLabel] })
  getRestrictedLabels(@Query('name') name?: string, @Query('type') type?: string) : Promise<Array<RestrictedLabel>> {
    return this.restrictedLabelsService.getRestrictedLabels(name, type);
  }

  @ApiOperation({ summary: 'Add a new restricted labels (admin Only)' })
  @Post()
  @ApiOkResponse({ description:'Return the generated Id of the new element', type: String })
  addRestrictedLabel(@Body() entity: addRestrictedLabel) : Promise<string> {
    return this.restrictedLabelsService.addRestrictedLabel(entity);
  }

  @ApiOperation({ summary: 'Update a restricted label name (admin only)' })
  @ApiParam({ name:'id', description: 'Id of the Restricted label to update', required: true })
  @ApiQuery({ name:'name', description: 'Updated name of the Restricted label to update', required: true })
  @Put('/:id')
  updateRestrictedLabel(@Param('id') id:string, @Query('name') name: string) : Promise<updateRestrictedLabel> {
    return this.restrictedLabelsService.updateRestrictedLabel(id, name);
  }
  
  @ApiOperation({ summary: 'Delete a restricted labels (admin only)' })
  @ApiParam({ name:'id', description: 'Id of the Restricted label to delete', required: true })
  @Delete('/:id')
  @HttpCode(204)
  deleteRestrictedLabel(@Param('id') id:string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.restrictedLabelsService.deleteRestrictedLabel(id)
        .then(() => resolve('Ok'))
        .catch((err) => reject(err));
    });
  }

  @ApiOperation({ summary: 'Get All the restricted labels types (enum)' })
  @Get('/types')
  getRestrictedLabelTypes() : Array<string> {
    return this.restrictedLabelsService.getRestrictedLabelTypes();
  }
}

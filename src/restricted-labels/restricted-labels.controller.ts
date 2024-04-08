import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RestrictedLabelsService } from './restricted-labels.service';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { updateRestrictedLabel } from './dto/updateRestrictedLabel.dto';

@Controller('restricted-labels')
export class RestrictedLabelsController {
  constructor(private readonly restrictedLabelsService: RestrictedLabelsService) {}

  @Get()
  getRestrictedLabels() : Array<RestrictedLabel> {
    this.restrictedLabelsService.getRestrictedLabels();
    return null;
  }

  @Post()
  addRestrictedLabel(@Body() entity: RestrictedLabel) : string {
    return null;
  }

  @Put()
  updateRestrictedLabel(@Body() updateEntity: updateRestrictedLabel) : void {

  }
  
  @Delete()
  deleteRestrictedLabel(@Param('id') id:string): void {

  }

  @Get()
  getRestrictedLabelTypes() : Array<string> {
    return null;
  }
}

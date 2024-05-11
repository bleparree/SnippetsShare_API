import { Controller, Get } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { typeList } from './entities/typeList.entity';

@ApiTags('Resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('/restrictedLabelTypes')
  @ApiOperation({ summary: 'Get All the restricted labels types (enum)' })
  @ApiOkResponse({ description:'Return the complete list of Restricted Label Type', type: String, isArray: true })
  getRestrictedLabelTypes() : Array<string> {
    return this.resourcesService.getRestrictedLabelTypes();
  }
  
  @Get('/userRoles')
  @ApiOperation({ summary: 'Get all the possible User Role' })
  @ApiOkResponse({ description:'Return the complete list of User Roles', type: String, isArray: true })
  getUserRoles() : Array<string> {
    return this.resourcesService.getUserRoles();
  }

  @Get('/userStatus')
  @ApiOperation({ summary: 'Get all the possible User status' })
  @ApiOkResponse({ description:'Return the complete list of Users Status', type: String, isArray: true })
  getUserStatus() : Array<string> {
    return this.resourcesService.getUserStatus();
  }
}

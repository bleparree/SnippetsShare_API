import { Controller, Get } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('/restrictedLabelTypes')
  @ApiOperation({ summary: 'Get All the restricted labels types (enum)' })
  @ApiOkResponse({ description:'Return the complete list of RLabel Type', type: Array<String> })
  getRestrictedLabelTypes() : Array<string> {
    return this.resourcesService.getRestrictedLabelTypes();
  }
  
  @Get('/userRoles')
  @ApiOperation({ summary: 'Get all the possible User Role' })
  @ApiOkResponse({ description:'Return the complete list of User Roles', type: Array<String> })
  getUserRoles() : Array<string> {
    return this.resourcesService.getUserRoles();
  }

  @Get('/userStatus')
  @ApiOperation({ summary: 'Get all the possible User status' })
  @ApiOkResponse({ description:'Return the complete list of Users Status', type: Array<String> })
  getUserStatus() : Array<string> {
    return this.resourcesService.getUserStatus();
  }
}

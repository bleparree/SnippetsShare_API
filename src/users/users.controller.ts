import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { updateFullUser } from './dto/updateFullUser.dto';
import { addUser } from './dto/addUser.dto';
import { UserStatusList } from './entities/userStatusList.entity';
import { UserRoleList } from './entities/userRoleList.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get a single User by his Id' })
  @ApiParam({ name:'id', description: 'Id of the user to get', required: true })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  getUser(@Param('id') id:string) : Promise<User> {
    return null;
  }

  @Get()
  @ApiOperation({ summary: 'Get All Users filtered by username/Mail - role and status' })
  @ApiQuery({ name:'searchText', description: 'partial search into UserName AND EMails', required: false })
  @ApiQuery({ name:'role', description: 'Exact role to filter on', required: false, enum: UserRoleList })
  @ApiQuery({ name:'status', description: 'Exact statut to filter on', required: false, enum: UserStatusList })
  @ApiOkResponse({ type: [User] })
  getUsers(@Query('searchText') searchText?:string, @Query('role') role?:Array<UserRoleList>, @Query('status') status?:Array<UserStatusList>) : Promise<Array<User>> {
    return null;
  }

  @Post()
  @ApiOperation({ summary: 'To create a new user' })
  @ApiBody({ required: true} )
  @ApiOkResponse({ description:'Return the generated Id of the new element', type: String })
  addUser(@Body(new ValidationPipe({expectedType:User})) user:addUser) : Promise<string> {
    //ToDo (Send mail to Activate)
    return null;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'To fully update a user properties (Admin Only)' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiBody({ required: true} )
  @ApiOkResponse({ description:'Return the update object', type: updateFullUser })
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  updateUser(@Param('id') id:string, @Body(new ValidationPipe({expectedType:updateFullUser})) user:updateFullUser) : Promise<updateFullUser> {
    return null;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a user UserName' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiQuery({ name:'userName', description: 'Username to update', required: true })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  updateUser_UserName(@Param('id') id:string, @Query('userName') userName:string) : Promise<void> {
    return null;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a user Password' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiQuery({ name:'password', description: 'password to update', required: true })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  updateUser_Password(@Param('id') id:string, @Query('password') password:string) : Promise<void> {
    return null;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a user Status' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiQuery({ name:'status', description: 'status to update', required: true })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  updateUser_Status(@Param('id') id:string, @Query('status') status:UserStatusList) : Promise<void> {
    return null;
  }

  @Put('/resetPassword/:id')
  @ApiOperation({ summary: 'Reset a User password (send a link to do it by EMail' })
  @ApiParam({ name:'id', description: 'Id of the user to reset the password', required: true })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  resetPassword(@Param('id') id:string) : Promise<void> {
    return null;
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name:'id', description: 'Id of the user to delete', required: true })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  deleteUser(@Param('id') id:string) : Promise<void> {
    return null;
  }

  @Get('/roles')
  @ApiOperation({ summary: 'Get all the possible User Role' })
  @ApiOkResponse({ description:'Return the complete list of User Roles', type: Array<String> })
  getUserRoles() : Array<string> {
    return null;
  }

  @Get('/status')
  @ApiOperation({ summary: 'Get all the possible User status' })
  @ApiOkResponse({ description:'Return the complete list of Users Status', type: Array<String> })
  getUserStatus() : Array<string> {
    return null;
  }
}

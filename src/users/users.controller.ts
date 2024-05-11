import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseEnumPipe, Post, Put, Query, ValidationPipe,  } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBadRequestResponse, ApiBody, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateFullUser } from './dto/updateFullUser.dto';
import { AddUser } from './dto/addUser.dto';
import { UserStatusList, UserStatusValidationPipe } from 'src/resources/entities/userStatusList.entity';
import { UserRoleList, UserRoleValidationPipe } from 'src/resources/entities/userRoleList.entity';
import { GetUser } from './dto/getUser.dto';
import { MongoIdValidationPipe } from 'src/resources/pipes/mongoIdValidationPipe.pipe';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get a single User by his Id' })
  @ApiParam({ name:'id', description: 'Id of the user to get', required: true })
  @ApiOkResponse({ type: GetUser })
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  getUser(@Param('id', new MongoIdValidationPipe()) id:string) : Promise<GetUser> {
    return this.usersService.getUser(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Users filtered by username/Mail - role and status' })
  @ApiQuery({ name:'searchText', description: 'partial search into UserName AND EMails', required: false })
  @ApiQuery({ name:'role', description: 'Role or list of role to filter on', required: false, enum: UserRoleList })
  @ApiQuery({ name:'status', description: 'Statut or list of status to filter on', required: false, enum: UserStatusList })
  @ApiOkResponse({ type: [GetUser] })
  getUsers(
    @Query('searchText') searchText?:string, 
    @Query('role', new UserRoleValidationPipe()) role?:Array<UserRoleList>, 
    @Query('status', new UserStatusValidationPipe()) status?:Array<UserStatusList>) : Promise<Array<GetUser>> {
    return this.usersService.getUsers(searchText, role, status);
  }

  @Post()
  @ApiOperation({ summary: 'To create a new user' })
  @ApiBody({ required: true, type: AddUser } )
  @ApiOkResponse({ description:'Return the generated Id of the new element', type: String })
  @ApiBadRequestResponse({description: 'If entity wrongly composed'})
  addUser(@Body(new ValidationPipe({expectedType:AddUser})) user:AddUser) : Promise<string> {
    return this.usersService.addUser(user);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'To fully update a user properties (Admin Only)' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiBody({ required: true, type:UpdateFullUser } )
  @ApiOkResponse({ description:'Return the update object', type: UpdateFullUser })
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  updateUser(@Param('id', new MongoIdValidationPipe()) id:string, @Body(new ValidationPipe({expectedType:UpdateFullUser})) user:UpdateFullUser) : Promise<UpdateFullUser> {
    return this.usersService.updateUser(id, user);
  }

  @Put('/updateUserName/:id')
  @ApiOperation({ summary: 'Update a user UserName' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiQuery({ name:'userName', description: 'Username to update', required: true })
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  @ApiBadRequestResponse({description: 'If id wrongly composed'})
  updateUser_UserName(@Param('id', new MongoIdValidationPipe()) id:string, @Query('userName') userName:string) : Promise<void> {
    if (userName == null || userName.length == 0) { throw new BadRequestException('userName Parameter is required'); }
    return this.usersService.updateUser_UserName(id, userName);
  }

  @Put('/updatePassword/:id')
  @ApiOperation({ summary: 'Update a user Password' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiQuery({ name:'password', description: 'password to update', required: true })
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  @ApiBadRequestResponse({description: 'If id wrongly composed'})
  updateUser_Password(@Param('id', new MongoIdValidationPipe()) id:string, @Query('password') password:string) : Promise<void> {
    if (password == null || password.length == 0) { throw new BadRequestException('password Parameter is required'); }
    return this.usersService.updateUser_Password(id, password);
  }

  @Put('/updateStatus/:id')
  @ApiOperation({ summary: 'Update a user Status' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiQuery({ name:'status', description: 'status to update', required: true })
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  @ApiBadRequestResponse({description: 'If id or status wrongly composed'})
  updateUser_Status(@Param('id', new MongoIdValidationPipe()) id:string, @Query('status', new ParseEnumPipe(UserStatusList)) status:UserStatusList) : Promise<void> {
    if (status == null || status.length == 0) { throw new BadRequestException('status Parameter is required'); }
    return this.usersService.updateUser_Status(id, status);
  }

  @Put('/resetPassword/:id')
  @ApiOperation({ summary: 'Reset a User password (send a link to do it by EMail' })
  @ApiParam({ name:'id', description: 'Id of the user to reset the password', required: true })
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  @ApiBadRequestResponse({description: 'If id wrongly composed'})
  resetPassword(@Param('id', new MongoIdValidationPipe()) id:string) : Promise<void> {
    return this.usersService.resetPassword(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name:'id', description: 'Id of the user to delete', required: true })
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  @ApiBadRequestResponse({description: 'If id wrongly composed'})
  deleteUser(@Param('id', new MongoIdValidationPipe()) id:string) : Promise<void> {
    return this.usersService.deleteUser(id);
  }
}

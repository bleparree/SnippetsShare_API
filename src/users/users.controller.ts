import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, ValidationPipe,  } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateFullUser } from './dto/updateFullUser.dto';
import { AddUser } from './dto/addUser.dto';
import { UserStatusList } from 'src/resources/entities/userStatusList.entity';
import { UserRoleList } from 'src/resources/entities/userRoleList.entity';
import { GetUser } from './dto/getUser.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get a single User by his Id' })
  @ApiParam({ name:'id', description: 'Id of the user to get', required: true })
  @ApiOkResponse({ type: GetUser })
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  getUser(@Param('id') id:string) : Promise<GetUser> {
    return this.usersService.getUser(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Users filtered by username/Mail - role and status' })
  @ApiQuery({ name:'searchText', description: 'partial search into UserName AND EMails', required: false })
  @ApiQuery({ name:'role', description: 'Exact role to filter on', required: false, enum: UserRoleList })
  @ApiQuery({ name:'status', description: 'Exact statut to filter on', required: false, enum: UserStatusList })
  @ApiOkResponse({ type: [GetUser] })
  getUsers(@Query('searchText') searchText?:string, @Query('role') role?:Array<UserRoleList>, @Query('status') status?:Array<UserStatusList>) : Promise<Array<GetUser>> {
    return this.usersService.getUsers(searchText, role, status);
  }

  @Post()
  @ApiOperation({ summary: 'To create a new user' })
  @ApiBody({ required: true} )
  @ApiOkResponse({ description:'Return the generated Id of the new element', type: String })
  addUser(@Body(new ValidationPipe({expectedType:AddUser})) user:AddUser) : Promise<string> {
    return this.usersService.addUser(user);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'To fully update a user properties (Admin Only)' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiBody({ required: true} )
  @ApiOkResponse({ description:'Return the update object', type: UpdateFullUser })
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  updateUser(@Param('id') id:string, @Body(new ValidationPipe({expectedType:UpdateFullUser})) user:UpdateFullUser) : Promise<UpdateFullUser> {
    return this.usersService.updateUser(id, user);
  }

  @Put('/updateUserName/:id')
  @ApiOperation({ summary: 'Update a user UserName' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiQuery({ name:'userName', description: 'Username to update', required: true })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  updateUser_UserName(@Param('id') id:string, @Query('userName') userName:string) : Promise<void> {
    if (userName == null || userName.length == 0) { throw new BadRequestException('userName Parameter is required'); }
    return this.usersService.updateUser_UserName(id, userName);
  }

  @Put('/updatePassword/:id')
  @ApiOperation({ summary: 'Update a user Password' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiQuery({ name:'password', description: 'password to update', required: true })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  updateUser_Password(@Param('id') id:string, @Query('password') password:string) : Promise<void> {
    if (password == null || password.length == 0) { throw new BadRequestException('password Parameter is required'); }
    return this.usersService.updateUser_Password(id, password);
  }

  @Put('/updateStatus/:id')
  @ApiOperation({ summary: 'Update a user Status' })
  @ApiParam({ name:'id', description: 'Id of the user to update', required: true })
  @ApiQuery({ name:'status', description: 'status to update', required: true })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  updateUser_Status(@Param('id') id:string, @Query('status') status:UserStatusList) : Promise<void> {
    if (status == null || status.length == 0) { throw new BadRequestException('status Parameter is required'); }
    return this.usersService.updateUser_Status(id, status);
  }

  @Put('/resetPassword/:id')
  @ApiOperation({ summary: 'Reset a User password (send a link to do it by EMail' })
  @ApiParam({ name:'id', description: 'Id of the user to reset the password', required: true })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  resetPassword(@Param('id') id:string) : Promise<void> {
    return this.usersService.resetPassword(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name:'id', description: 'Id of the user to delete', required: true })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: 'If unable to find the user id' })
  deleteUser(@Param('id') id:string) : Promise<void> {
    return this.usersService.deleteUser(id);
  }
}

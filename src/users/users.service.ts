import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { GetUser } from './dto/getUser.dto';
import { UserRoleList } from './entities/userRoleList.entity';
import { UserStatusList } from './entities/userStatusList.entity';
import { AddUser } from './dto/addUser.dto';
import { UpdateFullUser } from './dto/updateFullUser.dto';

@Injectable()
export class UsersService {
    constructor(@Inject('MONGO_CLIENT') private readonly db: Db) {}

    async getUser(id: string): Promise<GetUser> {
        return null;
    }

    async getUsers(searchText?: string, role?: Array<UserRoleList>, status?:Array<UserStatusList>): Promise<Array<GetUser>> {
        return null;
    }

    async addUser(user: AddUser): Promise<string> {
        //ToDo (Send mail to Activate)
        return null;
    }

    updateUser(id:string, user:UpdateFullUser) : Promise<UpdateFullUser> {
        return null;
    }

    updateUser_UserName(id:string, userName:string) : Promise<void> {
        return null;
    }

    updateUser_Password(id:string, password:string) : Promise<void> {
        return null;
    }

    updateUser_Status(id:string, status:UserStatusList) : Promise<void> {
        return null;
    }

    resetPassword(id:string) : Promise<void> {
        return null;
    }

    deleteUser(id:string) : Promise<void> {
        return null;
    }

    getUserRoles() : Array<string> {
        return ['zef','zef'];
    }

    getUserStatus() : Array<string> {
        return ['ef','zef','zef','zef'];
    }
}

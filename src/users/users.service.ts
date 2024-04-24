import { HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Db, Document, Filter, InsertOneResult, ObjectId, UpdateFilter, UpdateResult, WithId } from 'mongodb';
import { GetUser } from './dto/getUser.dto';
import { UserRoleList } from 'src/resources/entities/userRoleList.entity';
import { UserStatusList } from 'src/resources/entities/userStatusList.entity';
import { AddUser } from './dto/addUser.dto';
import { UpdateFullUser } from './dto/updateFullUser.dto';

@Injectable()
export class UsersService {
    constructor(@Inject('MONGO_CLIENT') private readonly db: Db) {}

    /**
     * Mongo access to get a specific user
     * @param id Id of the user to return
     * @returns the user if one is find (throw exception overwize)
     */
    async getUser(id: string): Promise<GetUser> {
        let ret: GetUser = new GetUser();
        let filterDocument:Filter<Document> = { _id: new ObjectId(id) };

        try {
            let value: WithId<Document> = await this.db.collection('RestrictedLabel').findOne(filterDocument);
            if (!value) throw new NotFoundException('No user can be found for id ' + id);
            
            ret.initWithMongoObject(value)
            return ret;
        }
        catch (err) { 
            if (err instanceof HttpException) throw err;
            else throw new InternalServerErrorException(err); 
        };
    }

    /**
     * Mongo access to get all the users or a reduced list filtered by username/mail or role or status
     * @param searchText filter on the username or the mail of the user (can be partial and the filter will be case insensitive)
     * @param role filter on the role (exact match only)
     * @param status filter on the status (exact match only)
     * @returns an array of GetUser dto
     */
    async getUsers(searchText?: string, role?: Array<UserRoleList>, status?:Array<UserStatusList>): Promise<Array<GetUser>> {
        let filterDocument:Filter<Document> = {};
        const filterSearch = 
            { $or: [
                { 'userName': { $regex: `^.*((?i)${searchText}).*$` }},
                { 'eMail': { $regex: `^.*((?i)${searchText}).*$` }}
            ]};
        const filterRole = { 'role': role };
        const filterStatus = { 'status': status };

        let filterArray = [];
        if (searchText) filterArray.push(filterSearch);
        if (role) filterArray.push(filterRole);
        if (status) filterArray.push(filterStatus);
        
        filterDocument = { $and: [ filterArray ] } 
    
        try {
          let value: WithId<Document>[] = await this.db.collection('User').find(filterDocument).toArray();
          if (value.length > 0) {
            return value.map(val => {
                let ret = new GetUser(); ret.initWithMongoObject(val);
                return ret;
            });
          }
          return [];
        }
        catch (err) { throw new InternalServerErrorException(err) };
    }

    /**
     * Mongo acess to add a new User
     * @param user Object to insert
     * @returns the created object Id
     */
    async addUser(user: AddUser): Promise<string> {
        try {
            let value:InsertOneResult<Document> = await this.db.collection('User').insertOne(user);
            if (value.acknowledged) return value.insertedId.toString();
            else throw 'InsertOneResult acknowledged status is false';
          }
          catch (err) { throw new InternalServerErrorException(err) };
    }

    /**
     * Mongo acess to update globaly an existing User
     * @param id The restricted label id to update
     * @param user the updated object
     * @returns the modified object
     */
    async updateUser(id:string, user:UpdateFullUser) : Promise<UpdateFullUser> {
        try {
            let value:UpdateResult<Document> = await this.db.collection('User').updateOne({ _id: new ObjectId(id) }, { $set: user })
            if (value.acknowledged && value.matchedCount == 1) {
                return user;
            }
            else throw new NotFoundException('Cannot find any User to update');
          }
          catch (err) { 
            if (err instanceof HttpException) throw err;
            else throw new InternalServerErrorException(err); 
          };
    }

    async updateUser_UserName(id:string, userName:string) : Promise<void> {
        return null;
    }

    async updateUser_Password(id:string, password:string) : Promise<void> {
        return null;
    }

    async updateUser_Status(id:string, status:UserStatusList) : Promise<void> {
        return null;
    }

    async resetPassword(id:string) : Promise<void> {
        return null;
    }

    async deleteUser(id:string) : Promise<void> {
        return null;
    }
}

import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';

@Injectable()
export class UsersService {
    constructor(@Inject('MONGO_CLIENT') private readonly db: Db) {}

}

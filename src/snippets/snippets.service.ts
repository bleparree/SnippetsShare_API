import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';

@Injectable()
export class SnippetsService {
  constructor(@Inject('MONGO_CLIENT') private readonly db: Db) {}
}

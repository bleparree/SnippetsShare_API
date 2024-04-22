import { HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { updateRestrictedLabel } from './dto/updateRestrictedLabel.dto';
import { Db, DeleteResult, Document, Filter, InsertOneResult, ObjectId, UpdateResult, WithId } from 'mongodb';
import { addRestrictedLabel } from './dto/addRestrictedLabel.dto';

@Injectable()
export class RestrictedLabelsService {
  constructor(@Inject('MONGO_CLIENT') private readonly db: Db) {}

  /**
   * Mongo access to get all the restricted label or a reduced list filtered by name or type
   * @param name filter on the name of the restricted label (can be partial and the filter will be case insensitive)
   * @param type filter on the type (exact match only)
   * @returns an array of RestrictedLabel entity
   */
  async getRestrictedLabels(name?:string, type?:string) : Promise<Array<RestrictedLabel>> {
    let filterDocument:Filter<Document> = {};
    const filterName = { 'name': { $regex: `^.*((?i)${name}).*$` } };
    const filterType = { 'type': type };

    if (type && name) filterDocument = { $and: [ filterType, filterName ] } 
    else if (type) filterDocument = filterType;
    else if (name) filterDocument = filterName;

    try {
      let value: WithId<Document>[] = await this.db.collection('RestrictedLabel').find(filterDocument).toArray();
      if (value.length > 0) {
        return value.map(val => new RestrictedLabel(val));
      }
      return [];
    }
    catch (err) { throw new InternalServerErrorException(err) };
  }

  /**
   * Mongo acess to add a new RestrictedLabel
   * @param addDTO Object to insert
   * @returns the created object Id
   */
  async addRestrictedLabel(addDTO: addRestrictedLabel) : Promise<string> {
    try {
      let value:InsertOneResult<Document> = await this.db.collection('RestrictedLabel').insertOne(addDTO);
      if (value.acknowledged) return value.insertedId.toString();
      else throw 'InsertOneResult acknowledged status is false';
    }
    catch (err) { throw new InternalServerErrorException(err) };
  }

  /**
   * Mongo acess to update a existing RestrictedLabel
   * @param updateDTO Object to update
   * @returns the modified object
   */
  async updateRestrictedLabel(id:string, name:string) : Promise<updateRestrictedLabel> {
    try {
      let value:UpdateResult<Document> = await this.db.collection('RestrictedLabel').updateOne({ _id: new ObjectId(id) }, { $set: { name: name }})
      if (value.acknowledged && value.matchedCount == 1) return new updateRestrictedLabel(id, name);
      else throw new NotFoundException('Cannot found any restrictedLabel to update');
    }
    catch (err) { 
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException(err); 
    };
  }
  
  /**
   * Delete a restrictedLabel
   * @param id RestrictedLabel id to delete
   */
  async deleteRestrictedLabel(id:string): Promise<void> {
    try {
      let value:DeleteResult = await this.db.collection('RestrictedLabel').deleteOne({ _id: new ObjectId(id) });
      if (!value.acknowledged || value.deletedCount == 0) throw new NotFoundException('Cannot found any restrictedLabel to delete');
    }
    catch (err) { 
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException(err); 
    };
  }
}

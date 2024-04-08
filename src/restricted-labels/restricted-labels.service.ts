import { Inject, Injectable } from '@nestjs/common';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { updateRestrictedLabel } from './dto/updateRestrictedLabel.dto';
import { Db } from 'mongodb';

@Injectable()
export class RestrictedLabelsService {
  constructor(@Inject('MONGO_CLIENT') private readonly db: Db) {}
    
  getRestrictedLabels() : Array<RestrictedLabel> {
    const res = this.db.collection('RestrictedLabel').find();
    console.log(res);
    return null;
  }

  addRestrictedLabel(entity: RestrictedLabel) : string {
    return null;
  }

  updateRestrictedLabel(updateEntity: updateRestrictedLabel) : void {

  }
  
  deleteRestrictedLabel(id:string): void {

  }

  getRestrictedLabelTypes() : Array<string> {
    return null;
  }
}

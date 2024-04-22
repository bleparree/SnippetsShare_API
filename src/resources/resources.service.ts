import { Injectable } from '@nestjs/common';
import { typeList } from './entities/typeList.entity';

@Injectable()
export class ResourcesService {
  /**
   * get all Restricted label types
   * @returns List of Restricted label types (from enum)
   */
  getRestrictedLabelTypes() : Array<string> {
    return Object.values(typeList);
  }

  getUserRoles() : Array<string> {
      return ['zef','zef'];
  }

  getUserStatus() : Array<string> {
      return ['ef','zef','zef','zef'];
  }
}

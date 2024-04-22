import { Injectable } from '@nestjs/common';
import { typeList } from './entities/typeList.entity';
import { UserRoleList } from './entities/userRoleList.entity';
import { UserStatusList } from './entities/userStatusList.entity';

@Injectable()
export class ResourcesService {
  /**
   * get all Restricted label types
   * @returns List of Restricted label types (from enum)
   */
  getRestrictedLabelTypes() : Array<string> {
    return Object.values(typeList);
  }

  /**
   * get all User Roles
   * @returns List of User Roles (from enum)
   */
  getUserRoles() : Array<string> {
      return Object.values(UserRoleList);
  }

  /**
   * get all User Status
   * @returns List of User Status (from enum)
   */
  getUserStatus() : Array<string> {
      return Object.values(UserStatusList);
  }
}

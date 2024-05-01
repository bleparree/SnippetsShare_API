import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

export enum UserStatusList {
    Activated = 'Activated',
    ToActivate = 'ToActivate',
    ReInitPassword = 'ReInitPassword',
    Suspended = 'Suspended'
}

@Injectable()
export class UserStatusValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value == null) return value;
        
        if (Array.isArray(value)) {
            value.forEach(v => {
                if (!(v in UserStatusList)) throw new BadRequestException(`${v} is not a User Role`);
            });
            return value;
        }
        else {
            if (value in UserStatusList)
                return [value];
            else
                throw new BadRequestException(`${value} is not a User Role`);
        }
    }
}
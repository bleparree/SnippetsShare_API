import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, ValidationPipeOptions } from "@nestjs/common";

export enum UserRoleList {
    User = 'User',
    SuperAdmin = 'SuperAdmin'
}

@Injectable()
export class UserRoleValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value == null) return value;

        if (Array.isArray(value)) {
            value.forEach(v => {
                if (!(v in UserRoleList)) throw new BadRequestException(`${v} is not a User Role`);
            });
            return value;
        }
        else {
            if (value in UserRoleList)
                return [value];
            else
                throw new BadRequestException(`${value} is not a User Role`);
        }
    }
}
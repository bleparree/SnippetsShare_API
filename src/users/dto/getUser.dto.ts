import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Document, WithId } from "mongodb";
import { UserRoleList } from "src/resources/entities/userRoleList.entity";
import { UserStatusList } from "src/resources/entities/userStatusList.entity";

export class GetUser {
    @ApiProperty({ description:"User Unique identifier" })
    @IsString()
    @IsNotEmpty()
    id: string;
    
    @ApiProperty({ description:"User UserName" })
    @IsString()
    @IsNotEmpty()
    userName:string;
    
    @ApiProperty({ description:"User EMail" })
    @IsEmail()
    @IsNotEmpty()
    eMail:string;
    
    @ApiProperty({ enum:UserRoleList, description:"User Role (Simple User / Super Admin)" })
    @IsString()
    @IsEnum(UserRoleList)
    @IsNotEmpty()
    role:string;
    
    @ApiProperty({ enum:UserStatusList, description:"User Status (Activated / ToActivate / ReInitPassword / Suspended)" })
    @IsString()
    @IsEnum(UserStatusList)
    @IsNotEmpty()
    status:string;

    initWithMongoObject(doc:WithId<Document>): void {
        this.id = doc._id.toString();
        this.userName = doc.userName;
        this.eMail = doc.eMail;
        this.role = doc.role;
        this.status = doc.status;
    }
}

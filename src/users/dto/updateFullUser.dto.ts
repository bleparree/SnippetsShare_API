import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Document, UpdateResult } from "mongodb";
import { UserRoleList } from "src/resources/entities/userRoleList.entity";
import { UserStatusList } from "src/resources/entities/userStatusList.entity";

export class UpdateFullUser {
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
}

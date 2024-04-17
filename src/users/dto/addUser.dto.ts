import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class addUser {
    @ApiProperty({ description:"User UserName" })
    @IsString()
    @IsNotEmpty()
    userName:string;
    
    @ApiProperty({ description:"User Password" })
    @IsString()
    @IsNotEmpty()
    password:string;
    
    @ApiProperty({ description:"User EMail" })
    @IsEmail()
    @IsNotEmpty()
    eMail:string;
}

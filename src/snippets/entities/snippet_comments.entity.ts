import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Snippet_comments {
    @ApiProperty({ description:"Comment Id" })
    @IsString()
    @IsOptional()
    id:string;

    @ApiProperty({ description:"Comment" })
    @IsString()
    @IsNotEmpty()
    comment:string;

    @ApiProperty({ description:"Author of the comment" })
    @IsString()
    @IsNotEmpty()
    author:string;

    @ApiProperty({ description:"Date of the comment" })
    @IsDate()
    @IsNotEmpty()
    date:Date;
}
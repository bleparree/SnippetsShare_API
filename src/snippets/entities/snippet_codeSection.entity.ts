import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class Snippet_codeSection {
    @ApiProperty({ description:"Code section" })
    @IsString()
    @IsNotEmpty()
    codeSection:string;

    @ApiProperty({ description:"Code section Path (./ by default)" })
    @IsString()
    @IsOptional()
    path:string;

    @ApiProperty({ description:"Code section Type (type of code/file)" })
    @IsString()
    @IsNotEmpty()
    type:string;

    @ApiProperty({ description:"Code section position" })
    @IsNumber()
    @IsNotEmpty()
    order:number;
}
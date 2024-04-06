import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

export class RestrictedLabel {
    @ApiProperty({ description:"RestrictedLabel Unique identifier" })
    @IsString()
    id: string;
    
    @ApiProperty({ description:"Name of the label" })
    @IsString()
    name:string;
    
    @ApiProperty({ description:"Type of label" })
    @IsString()
    @IsEnum(['Code','Repository','FreeLabel'])
    type:string;
}

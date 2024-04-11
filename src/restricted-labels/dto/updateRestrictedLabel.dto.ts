import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class updateRestrictedLabel {
    @ApiProperty({ description:"RestrictedLabel Unique identifier" })
    @IsString()
    id: string;
    
    @ApiProperty({ description:"Name of the label" })
    @IsString()
    name:string;

    constructor(id?:string, name?:string) {
        this.id = id;
        this.name = name;
    }
}

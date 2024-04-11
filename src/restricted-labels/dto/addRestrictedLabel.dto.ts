import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { typeList } from "../entities/typeList.entity";

export class addRestrictedLabel {

    @ApiProperty({ description:"Name of the label" })
    @IsString()
    name:string;
    
    @ApiProperty({ enum:typeList, description:"Type of label" })
    @IsString()
    @IsEnum(typeList)
    type:string;
}

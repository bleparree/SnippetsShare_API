import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsNotEmpty } from "class-validator";
import { typeList } from "src/resources/entities/typeList.entity";

export class addRestrictedLabel {
    @ApiProperty({ description:"Name of the label" })
    @IsString()
    @IsNotEmpty()
    name:string;
    
    @ApiProperty({ enum:typeList, description:"Type of label" })
    @IsString()
    @IsNotEmpty()
    @IsEnum(typeList)
    type:string;
}

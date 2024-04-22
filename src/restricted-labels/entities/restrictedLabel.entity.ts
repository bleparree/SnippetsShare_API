import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { Document, WithId } from "mongodb";
import { typeList } from "src/resources/entities/typeList.entity";

export class RestrictedLabel {
    @ApiProperty({ description:"RestrictedLabel Unique identifier" })
    @IsString()
    id: string;
    
    @ApiProperty({ description:"Name of the label" })
    @IsString()
    name:string;
    
    @ApiProperty({ enum:typeList, description:"Type of label" })
    @IsString()
    @IsEnum(typeList)
    type:string;

    constructor(doc?:WithId<Document>) {
        this.id = doc?._id.toString();
        this.name = doc?.name;
        this.type = doc?.type;
    }
}

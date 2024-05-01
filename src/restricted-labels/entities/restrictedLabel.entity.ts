import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { Document, ObjectId, WithId } from "mongodb";
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

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try { new ObjectId(value as string); }
        catch { throw new BadRequestException(`${value} is not a valid Mongo ObjectId`); }
        return value;
    }
}
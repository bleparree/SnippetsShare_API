import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try { new ObjectId(value as string); }
        catch { throw new BadRequestException(`${value} is not a valid Mongo ObjectId`); }
        return value;
    }
}
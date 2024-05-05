import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class Snippet_notation {
    @ApiProperty({ description:"Count of notation" })
    @IsNumber()
    @IsOptional()
    count:number;

    @ApiProperty({ description:"Average notation" })
    @IsNumber()
    @Max(5)
    @Min(0)
    @IsOptional()
    averageNotation:number;
}

@Injectable()
export class NotationValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try { 
            let v = parseInt(value);
            if (v < 1 || v > 5 || isNaN(v) == true) throw new Error();
        }
        catch { throw new BadRequestException(`${value} is not a valid Notation (integer between 1 and 5)`); }
        
        return value;
    }
}
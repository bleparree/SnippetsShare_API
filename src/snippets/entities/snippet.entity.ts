import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDefined, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { snippetStatusList } from "src/resources/entities/snippetStatusList.entity";
import { Snippet_codeSection } from "./snippet_codeSection.entity";
import { Snippet_notation } from "./snippet_notation.entity";
import { Snippet_comments } from "./snippet_comments.entity";
import { Document, WithId } from "mongodb";

export class Snippet {
    @ApiProperty({ description:"Snippet Unique identifier" })
    @IsString()
    @IsNotEmpty()
    id:string;

    @ApiProperty({ description:"Snippet name" })
    @IsString()
    @IsNotEmpty()
    name:string;

    @ApiProperty({ description:"Snippet description" })
    @IsString()
    @IsOptional()
    description:string;

    @ApiProperty({ description:"Author of the snippet represented by his user id" })
    @IsString()
    @IsNotEmpty()
    authorId:string;

    @ApiProperty({ description:"Code Label among a list of restricted label" })
    @IsString()
    @IsNotEmpty()
    codeLabelId:string;

    @ApiProperty({ description:"Repository Label among a list of restricted label" })
    @IsString()
    @IsNotEmpty()
    repositoryLabelId:string;

    @ApiProperty({ description:"List of free restricted label" })
    @IsArray()
    @IsOptional()
    freeLabels:Array<string>;

    @ApiProperty({ description:"List of keyword to optimize the search" })
    @IsArray()
    @IsOptional()
    searchKeywords:Array<string>;

    @ApiProperty({ description:"List of keyword to optimize the search" })
    @IsDefined()
    relevanceRank:Snippet_notation;

    @ApiProperty({ description:"List of keyword to optimize the search" })
    @IsDefined()
    solutionNotation:Snippet_notation;

    @ApiProperty({ description:"Code sections of the snippet" })
    @IsArray()
    @IsDefined()
    codeSections:Array<Snippet_codeSection>;

    @ApiProperty({ description:"Status (private/public) of the snippet" })
    @IsEnum(snippetStatusList)
    @IsNotEmpty()
    status:snippetStatusList;

    @ApiProperty({ description:"Public comments on the snippet" })
    @IsArray()
    @IsOptional()
    comments:Array<Snippet_comments>;

    constructor();
    constructor(fullDbObject:WithId<Document>);
    constructor(fullDbObject?:WithId<Document>) {
        if (fullDbObject) {
            this.id = fullDbObject._id.toString();
            this.name = fullDbObject.name;
            this.description = fullDbObject.description;
            this.codeLabelId = fullDbObject.codeLabelId;
            this.repositoryLabelId = fullDbObject.repositoryLabelId;
            this.authorId = fullDbObject.authorId;
            this.freeLabels = fullDbObject.freeLabels;
            this.searchKeywords = fullDbObject.searchKeywords;
            this.solutionNotation = fullDbObject.solutionNotation;
            this.relevanceRank = fullDbObject.relevanceRank;
            this.codeSections = fullDbObject.codeSections;
            this.status = fullDbObject.status;
            this.comments = fullDbObject.comments;
        }
    }
}
import { OmitType } from "@nestjs/swagger";
import { Snippet } from "../entities/snippet.entity";

export class AddSnippet extends OmitType(Snippet, ['id', 'comments', 'solutionNotation', 'relevanceRank']) {}
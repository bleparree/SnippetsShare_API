import { OmitType } from "@nestjs/swagger";
import { Snippet } from "../entities/snippet.entity";

export class UpdateSnippet extends OmitType(Snippet, ['id', 'comments', 'solutionNotation', 'relevanceRank']) {}
import { OmitType } from "@nestjs/swagger";
import { Snippet_comments } from "../entities/snippet_comments.entity";

export class AddSnippetComment extends OmitType(Snippet_comments, ['id', 'date']) {

}
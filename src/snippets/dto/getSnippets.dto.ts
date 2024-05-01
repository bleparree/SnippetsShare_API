import { OmitType } from "@nestjs/swagger";
import { Snippet } from "../entities/snippet.entity";

export class GetSnippets extends OmitType(Snippet, ['description', 'freeLabels', 'codeSections', 'searchKeyword', 'comments']) {

}
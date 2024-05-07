import { OmitType } from "@nestjs/swagger";
import { Snippet } from "../entities/snippet.entity";

export class AddSnippet extends OmitType(Snippet, ['id', 'comments', 'solutionNotation', 'relevanceRank']) {}

export class AddSnippetForInsert extends OmitType(Snippet, ['id']) {
    constructor();
    constructor(addSnippet:AddSnippet);
    constructor(addSnippet?:AddSnippet) {
        super();
        if (addSnippet) {
            this.name = addSnippet.name;
            this.description = addSnippet.description;
            this.codeLabelId = addSnippet.codeLabelId;
            this.repositoryLabelId = addSnippet.repositoryLabelId;
            this.authorId = addSnippet.authorId;
            this.freeLabels = addSnippet.freeLabels;
            this.searchKeywords = addSnippet.searchKeywords;
            this.solutionNotation = {averageNotation:0, count:0};
            this.relevanceRank = {averageNotation:0, count:0};
            this.codeSections = addSnippet.codeSections;
            this.status = addSnippet.status;
            this.comments = [];
        }
    }
}
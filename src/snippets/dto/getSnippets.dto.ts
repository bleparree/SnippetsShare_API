import { OmitType } from "@nestjs/swagger";
import { Snippet } from "../entities/snippet.entity";
import { Document, WithId } from "mongodb";

export class GetSnippets extends OmitType(Snippet, ['description', 'freeLabels', 'codeSections', 'searchKeywords', 'comments']) {

    constructor();
    constructor(fullDbObject:WithId<Document>);
    constructor(fullDbObject?:WithId<Document>) {
        super();
        if (fullDbObject) {
            this.id = fullDbObject._id.toString();
            this.name = fullDbObject.name;
            this.codeLabelId = fullDbObject.codeLabelId;
            this.repositoryLabelId = fullDbObject.repositoryLabelId;
            this.authorId = fullDbObject.authorId;
            this.solutionNotation = fullDbObject.solutionNotation;
            this.relevanceRank = fullDbObject.relevanceRank;
            this.status = fullDbObject.status;
        }
    }
}
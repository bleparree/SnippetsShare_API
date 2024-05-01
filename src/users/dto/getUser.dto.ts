import { OmitType } from "@nestjs/swagger";
import { Document, WithId } from "mongodb";
import { User } from "../entities/user.entity";

export class GetUser extends OmitType(User, ['password']) {
    constructor();
    constructor(doc:WithId<Document>);
    constructor(doc?:WithId<Document>) {
        super();
        if (doc) {
            this.id = doc._id.toString();
            this.userName = doc.userName;
            this.eMail = doc.eMail;
            this.role = doc.role;
            this.status = doc.status;
        }
    };
}

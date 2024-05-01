import { OmitType } from "@nestjs/swagger";
import { RestrictedLabel } from "../entities/restrictedLabel.entity";

export class updateRestrictedLabel extends OmitType(RestrictedLabel, ['type']) {
    constructor(id?:string, name?:string) {
        super();
        this.id = id;
        this.name = name;
    }
}

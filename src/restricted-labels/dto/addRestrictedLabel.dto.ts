import { OmitType } from "@nestjs/swagger";
import { RestrictedLabel } from "../entities/restrictedLabel.entity";

export class addRestrictedLabel extends OmitType(RestrictedLabel, ['id']) {}

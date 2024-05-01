import { OmitType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class UpdateFullUser extends OmitType(User, ['id', 'password']) {}

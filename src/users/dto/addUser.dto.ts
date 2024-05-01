import { OmitType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class AddUser extends OmitType(User, ['id', 'role', 'status']) {}

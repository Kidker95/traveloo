import { Role } from "./Enums";

export class UserModel {
    public _id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public role: Role;
}
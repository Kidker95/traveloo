import crypto from "crypto";
import { appConfig } from "./app-config";
import { IUserModel } from "../3-models/user-model";
import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "../3-models/enums";


class Cyber {

    public hash(plainText: string): string {
        if (!plainText) return null;
        return crypto.createHmac("sha512", appConfig.hashingSalt).update(plainText).digest("hex");

    }

    public getNewToken(user: IUserModel): string {
        delete user.password;
        const payload = { user };
        const options: SignOptions = { expiresIn: "3h" };
        const token = jwt.sign(payload, appConfig.jwtSecret, options);
        return token;
    }

    public validateToken(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, appConfig.jwtSecret);
            return true;
        } catch (err: any) { return false; }
    }

    public validateAdmin(token: string): boolean {
        const payload = jwt.decode(token) as { user: IUserModel };
        const user = payload.user;
        return user.role === Role.Admin;
    }

    public decodeToken(token: string): { _id: string; role: string } | null {
        try {
            const payload = jwt.verify(token, appConfig.jwtSecret) as { user: IUserModel };
            if (typeof payload.user._id === "string" && typeof payload.user.role === "string") {
                return { _id: payload.user._id, role: payload.user.role }; // Return decoded payload
            } else {
                return null; // If the _id or role is not of type string, return null
            }
        } catch (error) {
            return null; // Return null if the token is invalid
        }
    }
}

export const cyber = new Cyber();
import { Document, model, Schema } from "mongoose";
import { Role } from "./enums";



export interface IUserModel extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

export const UserSchema = new Schema<IUserModel>({
    firstName: {
        type: String,
        required: [true, "Missing first name"],
        minlength: [2, "Name too short"],
        maxlength: [50, "Name too long"],
        trim: true,
        validate: {
            validator: function () {
                if (this.lastName.indexOf(" ") >= 0) return false;
                return true;
            }, message: "Name can't contain multiple spaces"
        }
    },
    lastName: {
        type: String,
        required: [true, "Missing last name"],
        minlength: [2, "Name too short"],
        maxlength: [50, "Name too long"],
        trim: true,
        validate: {
            validator: function () {
                if (this.lastName.indexOf(" ") >= 0) return false;
                return true;
            }, message: "Name can't contain multiple spaces"
        }
    },
    email: {
        type: String,
        required: [true, "Email Required"],
        unique: true,
        trim: true,
        minlength: [5, "Email too short"],
        maxlength: [100, "Email too long"],
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid Email format.",
        ],
    },
    password: {
        type: String,
        required: [true, "Missing Password"],
        minlength: [7, "Password too short"],
        maxlength: [200, "Password too long"],
    },
    role: {
        type: String,
        required: [true, "Missing role"],
        enum: Object.values(Role), // Ensures the value is 1 (Admin) or 2 (User)
        default: Role.User, // Defaults to regular user
    }

}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
})

declare module "express" {
    export interface Request {
        user?: { _id: string }; 
    }
}

export const UserModel = model<IUserModel>("UserModel", UserSchema, "users")


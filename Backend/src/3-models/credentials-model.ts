import { Document, model, Schema } from "mongoose";


export interface ICredentialsModel extends Document {
    email: string;
    password: string;
}

export const CredentialsSchema = new Schema<ICredentialsModel>({
    email: {
        type: String,
        required: [true, "Email Required"],
        minlength: [6, "Email too short"],
        maxlength: [100, "Email too long"],
        trim: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
            "Invalid email format",
        ],
    },
    password: {
        type: String,
        required: [true, "Missing Password"],
        minlength: [7, "Password too short"],
        maxlength: [200, "Password too long"],
      
    }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
    autoCreate: false
})

export const CredentialsModel = model<ICredentialsModel>("CredentialsModel", CredentialsSchema,"credentials")
import { Document, model, Schema, Types } from "mongoose";


export interface ILikeModel extends Document {
    userId: Types.ObjectId; 
    vacationId: Types.ObjectId; 
}


const LikeSchema = new Schema<ILikeModel>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "UserModel", 
        required: true,
    },
    vacationId: {
        type: Schema.Types.ObjectId,
        ref: "VacationModel", 
        required: true,
    }
}, {
    versionKey: false,
    timestamps: true, 
});


export const LikeModel = model<ILikeModel>("LikeModel", LikeSchema, "likes");
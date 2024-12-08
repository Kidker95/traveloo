import { Document, model, Schema } from "mongoose";

export interface IVacationModel extends Document {
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    photoName: string;
    photoUrl: string;
}

export const VacationSchema = new Schema<IVacationModel>(
    {
        destination: {
            type: String,
            required: [true, "Missing destination"],
            minlength: [2, "Destination name too short."],
            maxlength: [100, "Destination name too long."],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Missing description"],
            minlength: [10, "Description too short."],
            maxlength: [1000, "Description too long."],
            trim: true,
        },
        startDate: {
            type: String,
            required: [true, "Missing start date"],
            match: [
                /^\d{4}-\d{2}-\d{2}$/,
                "Start date must be in YYYY-MM-DD format.",
            ],
            validate: {
                validator: function (value: string) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Reset time to 00:00:00
                    const selectedDate = new Date(value);
                    return selectedDate >= today;
                },
                message: "Start date cannot be in the past.",
            },
        },
        endDate: {
            type: String,
            required: [true, "Missing end date"],
            match: [
                /^\d{4}-\d{2}-\d{2}$/,
                "End date must be in YYYY-MM-DD format.",
            ],
            validate: {
                validator: function (value: string) {
                    return new Date(value) >= new Date(this.startDate);
                },
                message: "End date must be later than start date.",
            },
        },
        price: {
            type: Number,
            required: [true, "Missing price"],
            min: [0, "Price cannot be negative"],
            max: [10000, "Price can be 10000 max"],
        },
        photoName: {
            type: String,
        },
    },
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false,
    }
);

// Virtual field for generating photo URL
VacationSchema.virtual("photoUrl").get(function () {
    return `http://localhost:4000/api/vacations/images/${this.photoName}`;
});

VacationSchema.virtual("likesCount", {
    ref: "LikeModel", // Reference the likes collection
    localField: "_id", // Field in VacationModel
    foreignField: "vacationId", // Field in LikeModel
    count: true, // Return the count instead of the documents
});

// Model
export const VacationModel = model<IVacationModel>("VacationModel", VacationSchema, "vacations");

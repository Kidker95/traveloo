import { UploadedFile } from "express-fileupload";
import { Types } from "mongoose";
import { fileSaver } from "uploaded-file-saver";
import { BadRequestError, NotFoundError } from "../3-models/error-models";
import { LikeModel } from "../3-models/like-model";
import { IVacationModel, VacationModel } from "../3-models/vacation-model";

class VacationService {

    // ------------------- CRUD and GET's -------------------

    public async getAllVacations(): Promise<IVacationModel[]> {
        return VacationModel.find()
            .populate("likesCount") // Populate the virtual field
            .exec();
    }


    public async getOneVacation(_id: string): Promise<IVacationModel> {
        const vacation = await VacationModel.findById(_id)
            .populate("likesCount") // Populate the virtual field
            .exec();

        if (!vacation) {
            throw new NotFoundError(`Vacation with _id ${_id} not found.`);
        }

        const vacationObject = vacation.toJSON();
        delete vacationObject.photoName; // Remove the photo field if needed
        return vacationObject; // Return the vacation object
    }


    public async addVacation(vacation: IVacationModel, photo: UploadedFile): Promise<IVacationModel> {
        try {
            BadRequestError.validateSync(vacation);
            vacation.photoName = photo ? await fileSaver.add(photo) : null;
            if (!vacation.photoName) {
                throw new BadRequestError("Photo file could not be processed.");
            }
            await vacation.save();
            return this.getOneVacation(vacation._id.toString());
        } catch (error) {
            console.error("Error adding vacation:", error);
            throw error;
        }
    }


    public async updateVacation(vacation: IVacationModel, photo: UploadedFile): Promise<IVacationModel> {
        // Validate the vacation data
        BadRequestError.validateSync(vacation);

        const oldPhotoName = await this.getPhotoName(vacation._id.toString());
        const newPhotoName = photo ? await fileSaver.update(oldPhotoName, photo) : oldPhotoName;
        vacation.photoName = newPhotoName

        const dbVacation = await VacationModel.findByIdAndUpdate(vacation._id, vacation, { returnOriginal: false }).exec();
        if(!dbVacation) throw new NotFoundError(`_id ${vacation._id} not found`);
        return dbVacation;
    }



    public async deleteVacation(_id: string): Promise<void> {
        const dbVacation = await VacationModel.findById(_id).exec();
        if (!dbVacation) throw new NotFoundError(`Vacation with _id ${_id} not found.`);

        // Delete the associated photo file
        if (dbVacation.photoName) await fileSaver.delete(dbVacation.photoName);


        // Delete the vacation from the database
        await VacationModel.findByIdAndDelete(_id).exec();
    }


    // ------------------- Query -------------------


    public async getLikedVacations(userId: Types.ObjectId): Promise<IVacationModel[]> {

        const likedVacations = await LikeModel.find({ userId }).exec();

        const vacationIds = likedVacations.map(like => like.vacationId);

        return VacationModel.find({ _id: { $in: vacationIds } }).exec();
    }

    public async getVacationsNotStarted(): Promise<IVacationModel[]> {
        const today = new Date().toISOString().split('T')[0];
        const upcomingVacations = await VacationModel.find({ startDate: { $gt: today } }).exec();
        if (!upcomingVacations || upcomingVacations.length === 0) {
            throw new NotFoundError("No vacations found that haven't started yet.");
        }
        return upcomingVacations;
    }

    public async getVacationsOngoing(): Promise<IVacationModel[]> {
        const today = new Date().toISOString().split('T')[0];
        const ongoingVacations = await VacationModel.find({
            startDate: { $lte: today },
            endDate: { $gte: today },
        }).exec();

        if (!ongoingVacations || ongoingVacations.length === 0) {
            throw new NotFoundError("No vacations are currently ongoing.");
        }
        return ongoingVacations;
    }

    public async getLikesReport(): Promise<{ destination: string; likeCount: number }[]> {
        const results = await VacationModel.aggregate([
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "vacationId",
                    as: "likes",
                },
            },
            {
                $project: {
                    destination: 1,
                    likesCount: { $size: "$likes" },
                },
            },
            {
                $match: {
                    likesCount: { $gt: 0 },
                },
            },
        ]).exec();

        return results;
    }

    public async getPhotoName(_id: string): Promise<string> {
        const vacation = await VacationModel.findById(_id).exec();
        if (!vacation) return null;
        return vacation.photoName;
    }

}

export const vacationService = new VacationService();



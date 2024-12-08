import { Types } from "mongoose";
import { LikeModel } from "../3-models/like-model"; 

class LikeService {

    public async getLikesCountForVacation(vacationId: Types.ObjectId): Promise<number> {
        return LikeModel.countDocuments({ vacationId }).exec();
    }
    
    public async toggleLikeVacation(userId: Types.ObjectId, vacationId: Types.ObjectId): Promise<number> {
        const existingLike = await LikeModel.findOne({ userId, vacationId });
    
        if (existingLike) {
            // Remove the like if it exists
            await existingLike.deleteOne();
        } else {
            // Add a new like if it doesn't exist
            const newLike = new LikeModel({ userId, vacationId });
            await newLike.save();
        }
    
        // Calculate the updated likes count dynamically
        const updatedLikesCount = await this.getLikesCountForVacation(vacationId);
    
        // Return the updated likes count (optional, for client-side updates)
        return updatedLikesCount;
    }
    
}

export const likeService = new LikeService();

import axios, { AxiosRequestConfig } from "axios";
import { VacationModel } from "../Models/VacationModel";
import { appConfig } from "../Utils/AppConfig";
import { notify } from "../Utils/Notify";
import { UserModel } from "../Models/UserModel";
import { LikeModel } from "../Models/LikeModel";
import { store } from "../Redux/Store";
import { vacationAction } from "../Redux/VacationSlice";

class VacationService {

    // ----------------------- Usual GET's -----------------------

    public async getAllVacations(): Promise<VacationModel[]> {
        try {
            const response = await axios.get(appConfig.vacationsUrl);
            return response.data;
        } catch (err) {
            notify.error(err);
            throw err;
        }
    }

    public async getOneVacation(_id: string): Promise<VacationModel> {
        try {
            const response = await axios.get(`${appConfig.vacationsUrl}${_id}`);
            return response.data;
        } catch (err) {
            notify.error(err);
            throw err;
        }
    }

    // ----------------------- CRUD -----------------------

    public async addVacation(vacation: VacationModel): Promise<void> {
        try {
            const options: AxiosRequestConfig = {
                headers: { "Content-Type": "multipart/form-data" },
            };
            await axios.post(appConfig.vacationsUrl, vacation, options);
        } catch (err: any) {
            notify.error(err.message || "Failed to add vacation");
            throw err;
        }
    }
  
    public async updateVacation(vacation: VacationModel): Promise<void> {
        try {
            const options: AxiosRequestConfig = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            const response = await axios.put(`${appConfig.vacationsUrl}${vacation._id}`, vacation, options);
            const dbVacation = response.data;
            const action = vacationAction.updateVacation(dbVacation)
            store.dispatch(action);
        } catch (err) {
            notify.error(err);
            throw err;
        }
    }

    public async deleteVacation(_id: string): Promise<void> {
        try {
            await axios.delete(`${appConfig.vacationsUrl}${_id}`);
        } catch (err) {
            notify.error(err);
            throw err;
        }
    }

    // ----------------------- Special Queries -----------------------

    public async getLikedVacations(user: UserModel): Promise<VacationModel[]> {
        try {
            const response = await axios.get(`${appConfig.likedVacationsUrl}`, { params: { userId: user._id } });
            return response.data;
        } catch (err: any) {
            notify.error(err.message || "Failed to fetch liked vacations");
        }
    }

    public async getVacationsNotStarted(): Promise<VacationModel[]> {
        try {
            const response = await axios.get(`${appConfig.vacationsNotStartedUrl}`);
            return response.data;
        } catch (err: any) {
            notify.error(err.message || "Failed to fetch vacations not started");
            throw err;
        }
    }

    public async getVacationsOngoing(): Promise<VacationModel[]> {
        try {
            const response = await axios.get(`${appConfig.vacationsOngoingUrl}`);
            return response.data;
        } catch (err: any) {
            notify.error(err.message || "Failed to fetch vacations not started");
            throw err;
        }
    }

    // ----------------------- Admin Stuff -----------------------

    public async getLikesCount(): Promise<Partial<VacationModel>[]> {
        try {
            const response = await axios.get(`${appConfig.vacationsLikesCountUrl}`);
            return response.data;
        } catch (err: any) {
            notify.error(err.message || "Failed to fetch likes count");
            throw err;
        }
    }

    public async toggleLike(like: LikeModel): Promise<void> {
        try {
            // Send the toggle-like request to the backend
            const response = await axios.post(`${appConfig.likeVacationUrl}${like.vacationId}`, { userId: like.userId });

    
            // Get the updated likes count from the backend response
            const updatedLikesCount = response.data.likesCount;
    
            // Dispatch Redux action to update the likes count in the global state
            store.dispatch(
                vacationAction.toggleLikeVacation({
                    vacationId: like.vacationId,
                    likesCount: updatedLikesCount,
                })
            );
    
            notify.success("Vacation like status toggled successfully.");
        } catch (err: any) {
            notify.error(err.message || "Failed to toggle like.");
            throw err;
        }
    }

    public async getCsvLikesReport(): Promise<Blob> {
        try {
            const response = await axios.get(`${appConfig.vacationsCsvUrl}`, {
                responseType: "blob",
            });
            return response.data;
        } catch (err: any) {
            notify.error(err.message || "Failed to fetch likes report");
            throw err;
        }
    }

    
}

export const vacationService = new VacationService();
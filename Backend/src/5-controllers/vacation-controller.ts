import express, { NextFunction, request, Request, response, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { StatusCode } from "../3-models/enums";
import { VacationModel } from "../3-models/vacation-model";
import { vacationService } from "../4-services/vacation-service";
import path from "path";
import fs from 'fs';
import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../3-models/error-models";
import { Types } from "mongoose";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { likeService } from "../4-services/like-service";
import { Parser } from "json2csv";
import { fileSaver } from "uploaded-file-saver";




class VacationController {

    public readonly router = express.Router();

    public constructor() {
        this.router.get("/vacations", securityMiddleware.validateToken, this.getAllVacations);
        this.router.get("/vacations/liked", securityMiddleware.validateToken, this.getLikedVacations);
        this.router.get("/vacations/not-started", securityMiddleware.validateToken, this.getVacationsNotStarted);
        this.router.get("/vacations/ongoing", securityMiddleware.validateToken, this.getVacationsOngoing);
        this.router.get("/vacations/:_id([0-9a-f]{24})", securityMiddleware.validateToken, this.getOneVacation);
        this.router.post("/vacations", securityMiddleware.validateAdmin, this.addVacation);
        this.router.put("/vacations/:_id([0-9a-f]{24})", securityMiddleware.validateAdmin, this.updateVacation);
        this.router.delete("/vacations/:_id([0-9a-f]{24})", securityMiddleware.validateAdmin, this.deleteVacation);
        this.router.post("/vacations/like/:vacationId([0-9a-f]{24})", securityMiddleware.validateToken, this.toggleLike);
        this.router.get("/vacations/likes-csv", securityMiddleware.validateAdmin, this.getCsvLikesReport);
        this.router.get("/vacations/likes-count", securityMiddleware.validateAdmin, this.getLikesCount);
        this.router.get("/vacations/images/:photoName", this.getPhotoFile);

    }

    // ------------------- CRUD and GET's -------------------


    private async getAllVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const vacations = await vacationService.getAllVacations();
            response.json(vacations);
        } catch (err: any) { next(err); }
    }

    private async getOneVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const _id = request.params._id;
            const vacation = await vacationService.getOneVacation(_id);
            response.json(vacation);
        } catch (err: any) { next(err); }
    }

    private async addVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const vacation = new VacationModel(request.body);
            const dbVacation = await vacationService.addVacation(vacation, request.files?.photo as UploadedFile);
            response.status(StatusCode.Created).json(dbVacation);
        } catch (err: any) { next(err); }
    }

    private async updateVacation(request: Request, response: Response, next: NextFunction) {
        try {
            request.body._id = request.params._id;
            const vacation = new VacationModel(request.body);
            const dbVacation = await vacationService.updateVacation(vacation, request.files?.photo as UploadedFile);
            response.json(dbVacation);
        } catch (err: any) { next(err); }
    }

    private async deleteVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const _id = request.params._id;
            await vacationService.deleteVacation(_id);
            response.sendStatus(StatusCode.NoContent);
        } catch (err: any) { next(err); }

    }

    private getPhotoFile(request: Request, response: Response, next: NextFunction) {
        try {
            const photoName = request.params.photoName;
            const absolutePath = fileSaver.getFilePath(photoName);
            response.sendFile(absolutePath);
        } catch (err: any) { next(err); }
    }

    // ------------------- Query -------------------


    private async getLikedVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = request.user?._id;

            // Validate the user ID
            if (!userId || !Types.ObjectId.isValid(userId)) {
                throw new BadRequestError("Invalid userId");
            }

            // Convert userId to ObjectId instance
            const objectId = new Types.ObjectId(userId);

            // Fetch liked vacations from the service
            const likedVacations = await vacationService.getLikedVacations(objectId);

            // Send the result back as the response
            response.status(StatusCode.OK).json(likedVacations);
        } catch (err: any) { next(err); }
    }

    private async getVacationsNotStarted(request: Request, response: Response, next: NextFunction) {
        try {
            const vacations = await vacationService.getVacationsNotStarted();
            response.status(StatusCode.OK).json(vacations);
        } catch (err: any) {
            next(err);
        }
    }

    private async getVacationsOngoing(request: Request, response: Response, next: NextFunction) {
        try {
            const vacations = await vacationService.getVacationsOngoing();
            response.status(StatusCode.OK).json(vacations);
        } catch (err: any) {
            next(err);
        }
    }

    // ------------------- 👍🏻 -------------------


    private async toggleLike(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = request.body.userId || request.user?._id;
            const vacationId = request.params.vacationId;

            // Validate userId and vacationId
            if (!userId || !Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(vacationId)) {
                throw new BadRequestError("Invalid userId or vacationId");
            }

            // Perform the like/unlike toggle
            await likeService.toggleLikeVacation(new Types.ObjectId(userId), new Types.ObjectId(vacationId));

            response.status(StatusCode.OK).send("Vacation like status toggled successfully.");
        } catch (err: any) {
            next(err);
        }


    }

    // This is for the .csv
    private async getCsvLikesReport(request: Request, response: Response, next: NextFunction) {
        try {
            const report = await vacationService.getLikesReport();

            if (!report || report.length === 0) {
                return response.status(StatusCode.BadRequest).json("No Likes");
            }

            // Convert the JSON data to CSV
            const fields = ["destination", "likesCount"];
            const parser = new Parser({ fields });
            const csv = parser.parse(report);

            // Set headers for CSV download
            response.setHeader("Content-Type", "text/csv");
            response.setHeader("Content-Disposition", "attachment; filename=likes-report.csv");

            // Send the CSV data as a response
            response.status(StatusCode.OK).send(csv);

        } catch (err: any) {
            next(err);
        }
    }

    // This is for the chart
    private async getLikesCount(request: Request, response: Response, next: NextFunction) {
        try {
            const likes = await vacationService.getLikesReport();
            response.status(StatusCode.OK).json(likes);
        } catch (err: any) {
            next(err);
        }


    }



}

export const vacationController = new VacationController();
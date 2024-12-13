import express, { NextFunction, Request, Response } from "express";
import { CredentialsModel } from "../3-models/credentials-model";
import { UserModel } from "../3-models/user-model";
import { userService } from "../4-services/user-service";
import { StatusCode } from "../3-models/enums";
import { BadRequestError } from "../3-models/error-models";

class UserController {
    public router = express.Router();

    public constructor() {
        this.router.get("/users", this.getAllUsers);
        this.router.get("/users/:id^[0-9a-fA-F]{24}$", this.getUserById);
        this.router.post("/register", this.register);
        this.router.post("/login", this.login);

    }

    private async getAllUsers(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            response.status(StatusCode.OK).json(users);
        } catch (err) { next(err); }
    }

    private async getUserById(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const userId = request.params.id;
            const user = await userService.getUserById(userId);
            response.status(StatusCode.OK).json(user);
        } catch (err) { next(err); }
    }

    private async register(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const user = new UserModel(request.body);
            if (!user.firstName || !user.lastName || !user.email || !user.password) {
                throw new BadRequestError("Missing required fields");
            }
    
            const token = await userService.register(user);
            response.status(StatusCode.Created).json(token);
        } catch (err) {
            next(err); 
        }
    }
    

    private async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            
            const credentials = new CredentialsModel(request.body);
            
            // Ensure required fields are present
            if (!credentials.email || !credentials.password) {
                response.status(StatusCode.BadRequest).send("Missing email or password");
                return;
            }
            
            const token = await userService.login(credentials);
            response.status(StatusCode.OK).json(token);
        } catch (err) { next(err); }
    }

   
    
}

export const userController = new UserController();
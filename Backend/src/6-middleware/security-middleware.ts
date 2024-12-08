import { NextFunction, Request, Response } from "express";
import { cyber } from "../2-utils/cyber";
import { ForbiddenError, UnauthorizedError } from "../3-models/error-models";
import striptags from "striptags";
import { appConfig } from "../2-utils/app-config";
import jwt from 'jsonwebtoken'; 


class SecurityMiddleware {

    

    public validateToken(request: Request, response: Response, next: NextFunction): void {
        const header = request.headers.authorization;

        // Extract token from the Authorization header
        const token = header?.substring(7); // Assumes format: "Bearer <token>"

        // Validate the token
        if (!token || !cyber.validateToken(token)) {
            next(new UnauthorizedError("You are not logged-in")); 
            return;
        }

        try {
            // Verify the token and extract the payload
            const payload = jwt.verify(token, appConfig.jwtSecret) as { user: { _id: string } };
            // Set user ID in the request object
            request.user = { _id: payload.user._id }; // Now you can access request.user.id
            next();
        } catch (err) {
            next(new UnauthorizedError("Invalid token"));
        }
    }

    public validateAdmin(request: Request, response: Response, next: NextFunction): void {
        const header = request.headers.authorization;
        const token = header?.substring(7);

        if(!cyber.validateAdmin(token)){
            next( new ForbiddenError("You are unauthorized"));
            return;
        }
        next();
    }

    public preventXssAttack(request: Request, response: Response, next: NextFunction): void {
        for (const prop in request.body) {
            const value = request.body[prop];
            if (typeof value === 'string') {
                request.body[prop] = striptags(value);
            }
        }
        next();

    }


}

export const securityMiddleware = new SecurityMiddleware();
// securityMiddleware
import { NextFunction, Request, Response } from 'express';


class Logger {

    // Middleware to log requests to console and to requests.log
    public async logRequests(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            // Console log the request (first functionality)
            console.log("start-------------");
            console.log("Method: " + request.method);
            console.log("Route: " + request.originalUrl);
            console.log("Body: ", request.body);
            console.log("-------------end");
        } catch (err: any) { next(err); }

        // Move to the next middleware/controller
        next();
    }
}

export const logger = new Logger();

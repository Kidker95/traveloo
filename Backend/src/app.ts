import cors from "cors";
import express, { Express } from "express";
import fileUpload from "express-fileupload";
import path from "path";
import { fileSaver } from "uploaded-file-saver";
import { appConfig } from "./2-utils/app-config";
import { dal } from "./2-utils/dal";
import { userController } from "./5-controllers/user-controller";
import { vacationController } from "./5-controllers/vacation-controller";
import { errorMiddleware } from "./6-middleware/error-middleware";
import { logger } from "./6-middleware/logger";
import { securityMiddleware } from "./6-middleware/security-middleware";

class App {

    public server: Express; 

    public async start(): Promise<void> {

        // Create the server: 
        this.server = express();

        this.server.use(cors()); //if you have the front, ive got your back!

       
        // Tell express to create a request.body object from the body json:
        this.server.use(express.json());

        // Image Handling
        this.server.use(fileUpload());
        const absolutePath = path.join(__dirname, "1-assets", "images");
        fileSaver.config(absolutePath);
        this.server.use("/api/vacations/images", express.static(absolutePath));

        
        this.server.use(logger.logRequests);
        this.server.use(securityMiddleware.preventXssAttack);


        // Connect controllers to the server:
        this.server.use("/api", userController.router);

        this.server.use("/api", vacationController.router);

        // Register route not found middleware: 
        this.server.use("*", errorMiddleware.routeNotFound);

        // Register catch-all middleware: 
        this.server.use(errorMiddleware.catchAll);

        // Connect to MongoDB once:
        await dal.connect();
        
        this.server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
    }

}

export const app = new App(); // export app for the testing.
app.start();


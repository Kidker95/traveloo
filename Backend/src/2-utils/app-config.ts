import dotenv from "dotenv";

// Load ".env" file into process.env object:
dotenv.config();

class AppConfig {

    public readonly isDevelopment: boolean = process.env.ENVIRONMENT === "development";
    public readonly isProduction: boolean = process.env.ENVIRONMENT === "production";
    public readonly port = +process.env.PORT;

    public readonly hashingSalt = process.env.HASHING_SALT;
    public readonly jwtSecret = process.env.JWT_SECRET;

    public readonly mongoConnectionString = process.env.MONGODB_CONNECTION_STRING;

    

}

export const appConfig = new AppConfig();

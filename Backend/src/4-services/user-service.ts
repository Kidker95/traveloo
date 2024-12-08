import { cyber } from "../2-utils/cyber";
import { ICredentialsModel } from "../3-models/credentials-model";
import { Role } from "../3-models/enums";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../3-models/error-models";
import { IUserModel, UserModel } from "../3-models/user-model";

class UserService {

    public async getAllUsers(): Promise<IUserModel[]> {
        return UserModel.find().exec();
    }

    public async getUserById(_id: string): Promise<IUserModel> {
        const user = await UserModel.findById(_id).exec();
        if (!user) throw new NotFoundError(`_id ${_id} not found.`);
        return user;
    }

    public async register(user: IUserModel): Promise<string> {
        try {
            BadRequestError.validateSync(user);
    
            user.role = Role.User; // Default role
            user.password = cyber.hash(user.password); // Hash the password
    
            // Save user to database
            const savedUser = await UserModel.create(user);
    
            // Generate a token for the user
            const token = cyber.getNewToken(savedUser.toObject());
            return token;
        } catch (error: any) {
            if (error.code === 11000) {
                // Handle duplicate email error
                throw new BadRequestError("Email is already taken.");
            }
            throw error; // Re-throw other errors
        }
    }
    

    public async login(credentials: ICredentialsModel): Promise<string> {
        // Hash password
        BadRequestError.validateSync(credentials)

        credentials.password = cyber.hash(credentials.password);

        // Find user by email and hashed password
        const user = await UserModel.findOne({
            email: credentials.email,
            password: credentials.password,
        }).exec();

        if (!user) throw new UnauthorizedError("Email or password are incorrect");

        // Generate a token for the user
        const token = cyber.getNewToken(user.toObject());

        return token;
    }

    
}

export const userService = new UserService();
import axios from "axios";
import { UserModel } from "../Models/UserModel";
import { store } from '../Redux/Store';
import { userActions } from "../Redux/UserSlice";
import { appConfig } from "../Utils/AppConfig";
import { CredentialsModel } from "../Models/CredentialsModel";
import { jwtDecode } from "jwt-decode";


class UserService {

    public constructor() {
        const token = sessionStorage.getItem("token"); 
        if (!token) return;
        this.initUser(token);
    }

    public async register(user: UserModel) {
        const response = await axios.post<string>(appConfig.registerUrl, user);
        const token = response.data;
        this.initUser(token);
        sessionStorage.setItem("token", token);
    }

    public async login(credentials: CredentialsModel) {
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        const token = response.data;
        this.initUser(token);
        sessionStorage.setItem("token", token);
    }


    public logout() {
        const action = userActions.logoutUser();
        store.dispatch(action);
        sessionStorage.removeItem("token");
        
    }

    private initUser(token: string): void {
        const container = jwtDecode<{ user: UserModel }>(token);
        console.log(container);
        const dbUser = container.user;
        const action = userActions.initUser(dbUser);
        store.dispatch(action);
    }

    public async isEmailTaken(email:string): Promise<boolean>{
        const response = await axios.get<{ emailTaken: boolean }>(`${appConfig.isEmailTakenUrl}/${email}`);
        return response.data.emailTaken;
    }
}

export const userService = new UserService();
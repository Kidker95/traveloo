import { configureStore } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";
import { VacationModel } from "../Models/VacationModel";
import { UserSlice } from "./UserSlice";
import { vacationSlice } from "./VacationSlice";
import { loggerMiddleware } from "./Middleware";
import { CredentialsModel } from "../Models/CredentialsModel";

export type AppState = {
    user:UserModel;
    credentials:CredentialsModel;
    vacation:VacationModel[]
};

export const store = configureStore<AppState>({
    reducer: {
        user:UserSlice.reducer,
        credentials:UserSlice.reducer,
        vacation:vacationSlice.reducer
    },
    middleware: (getMiddleWare) => getMiddleWare().concat(loggerMiddleware) as any
});

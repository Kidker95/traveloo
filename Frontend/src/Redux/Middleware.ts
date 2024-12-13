import { configureStore, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./Store";


export const loggerMiddleware = (store: ReturnType<typeof configureStore<AppState>>) => (next: Dispatch) => (action: PayloadAction) => {


    const result = next(action);
    

    return result;
}
import { configureStore, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./Store";


export const loggerMiddleware = (store: ReturnType<typeof configureStore<AppState>>) => (next: Dispatch) => (action: PayloadAction) => {

    console.log("dispatching", action);

    const result = next(action);
    
    console.log("next state", store.getState());

    return result;
}
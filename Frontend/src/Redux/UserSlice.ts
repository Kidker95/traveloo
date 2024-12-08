import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserModel } from "../Models/UserModel";

// Init user(on login, on register):
export function initUser(currentState: UserModel, action: PayloadAction<UserModel>): UserModel{

    // Create new State which is the given user, and return it
    return action.payload;
}

// Logout user
export function logoutUser(currentState: UserModel, action: PayloadAction): UserModel{

     // Create new State which is the given user
     const newState: UserModel = null;

     // Return new state:
     return newState;
}

// User slice:
export const UserSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {initUser, logoutUser}
})

// Action creator:
export const userActions = UserSlice.actions;
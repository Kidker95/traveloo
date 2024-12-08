import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationModel } from "../Models/VacationModel";


// ------------------------- Initialization -------------------------

export function initVacation(currentState: VacationModel[], action: PayloadAction<VacationModel[]>): void {
    currentState.splice(0, currentState.length, ...action.payload); // Replace all items
}

// ------------------------- CRUD -------------------------

export function addVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): void {
    currentState.push(action.payload); // Add new vacation to the state
}

export function updateVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): void {
    const vacation = currentState.find(v => v._id === action.payload._id);
    if (vacation) {
        Object.assign(vacation, action.payload); // Update vacation details
    }
}

export function deleteVacation(currentState: VacationModel[], action: PayloadAction<string>): void {
    const index = currentState.findIndex(v => v._id === action.payload);
    if (index !== -1) {
        currentState.splice(index, 1); // Remove the vacation
    }
}

// ------------------------- Likes -------------------------

export function toggleLikeVacation(currentState: VacationModel[], action: PayloadAction<{ vacationId: string; likesCount: number }>): void {
    const vacation = currentState.find(v => v._id === action.payload.vacationId);
    if (vacation) {
        vacation.likesCount = action.payload.likesCount; // Update the likes count directly
    }
}



export const vacationSlice = createSlice({
    name: "vacation",
    initialState: [],
    reducers: { initVacation, addVacation, updateVacation, deleteVacation, toggleLikeVacation }
});

export const vacationAction = vacationSlice.actions;

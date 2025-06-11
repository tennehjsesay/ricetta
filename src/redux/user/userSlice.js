import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "userSlice",
    initialState: {user: null},
    reducers: {
        setUser: (state, {payload}) => {
            state.user = payload
        },
        clearUser: (state) => {
            state.user = {}
        }
    }
})

export const {
    setUser,
    clearUser
} = userSlice.actions
export const userSliceReducer = userSlice.reducer
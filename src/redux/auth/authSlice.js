import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    token: null,
    user: null,
    isAuthLoading: true
}

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setCredentials: (state, {payload}) => {
            state.token = payload.token
            state.user = payload.user
            state.isAuthLoading = null
        },
        clearCredentials: (state) => {
            state.token = null,
            state.user = null,
            state.isAuthLoading = true
        }
    }
});

export const {setCredentials, clearCredentials} = authSlice.actions
export const authReducer = authSlice.reducer
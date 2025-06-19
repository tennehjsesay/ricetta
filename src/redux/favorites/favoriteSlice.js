import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
    name: "favoritesSlice",
    initialState: {favorites: []},
    reducers: {
        setFavorites: (state, {payload}) => {
            state.favorites = payload
        },
        clearFavorites: (state) => {
            state.favorites = []
        }
    }
});

export const {
    setFavorites,
    clearFavorites
} = favoritesSlice.actions

export const favoritesSliceReducer = favoritesSlice.reducer
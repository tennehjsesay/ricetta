import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/authSlice";
import { authApi } from "./auth/authApi";
import { userSliceReducer } from "./user/userSlice";
import { userApi } from "./user/userApi";
import { recipeApi } from "./recipes/recipeApi";
import { favoritesSliceReducer } from "./favorites/favoriteSlice";
import { favoriteApi } from "./favorites/favoriteApi";

const store = configureStore({
    reducer: {
        userSlice: userSliceReducer,
        authSlice: authReducer,
        favoriteSlice: favoritesSliceReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [recipeApi.reducerPath]: recipeApi.reducer,
        [favoriteApi.reducerPath]: favoriteApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, recipeApi.middleware, favoriteApi.middleware)
});

export default store;
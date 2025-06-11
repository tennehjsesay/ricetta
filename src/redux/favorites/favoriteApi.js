import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth from "../baseQueryWithReAuth";

export const favoriteApi = createApi({
    reducerPath: "favoriteApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ['Favorite'],
    endpoints: (builder) => ({
        getFavorites: builder.query({
            query: (userId) => ({
                url: `/favorite/${userId}`
            }),
            providesTags: ['Favorite']
        }),
        addFavorite: builder.mutation({
            query: (recipe) => ({
                url: "/favorite",
                method: "POST",
                body: recipe
            }),
            invalidatesTags: ['Favorite']
        }),
        deleteFavorite: builder.mutation({
            query: (recipeId) => ({
                url: `/favorite/${recipeId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Favorite']
        }),
    })
})

export const {
    useAddFavoriteMutation,
    useDeleteFavoriteMutation,
    useGetFavoritesQuery
} = favoriteApi
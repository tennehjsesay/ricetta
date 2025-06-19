import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth from "../baseQueryWithReAuth";

const API_KEY = "81ed65bd586f476bb16ac28546012d82"

export const recipeApi = createApi({
    reducerPath: "recipeApi",
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        homeRecipes: builder.query({
            query: () => ({
                url: '/recipes/random',
            })
        }),
        getRecipe: builder.query({
            query: (id) => ({
                url: `/recipes/${id}`
            })
        }),
        getPageRecipes: builder.query({
            query: (offset) => ({
                url: `/recipes/complexSearch/${offset}`,
            })
        })
    })
})

export const {
    useHomeRecipesQuery,
    useGetRecipeQuery,
    useGetPageRecipesQuery
} = recipeApi
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth from "../baseQueryWithReAuth";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (userId) => ({
                url: `/users/${userId}`,
            }),
            providesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: (userData) => ({
                url: `/users`,
                method: "POST",
                body: userData
            }),
            invalidatesTags: ['User']
        }),
    })
})

export const {
    useGetUserQuery,
    useUpdateUserMutation
} = userApi
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth from "../baseQueryWithReAuth";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        signUp: builder.mutation({
            query: (userData) => ({
                url: "/signup",
                method: "POST",
                body: userData
            })
        }),
        signIn: builder.mutation({
            query: (credentials) => ({
                url: "/auth",
                method: "POST",
                body: credentials
            })
        }),
        signOut: builder.mutation({
            query: () => ({
                url: 'signout',
                method: 'POST'
            })
        }),
        verifyEmail: builder.query({
            query: (token) => ({
                url: `/verify/${token}`,
            })
        })
    })
})

export const {
    useSignUpMutation,
    useSignInMutation,
    useSignOutMutation,
    useVerifyEmailQuery
} = authApi
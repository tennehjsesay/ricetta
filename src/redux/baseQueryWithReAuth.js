import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { clearCredentials, setCredentials } from "./auth/authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: "https://ricettaserver.onrender.com",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().authSlice.token
        if(token){
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if(result.error?.status === 401){
        const refreshResult = await baseQuery("/refresh", api, extraOptions)
        if(refreshResult?.data){
            api.dispatch(setCredentials({token: refreshResult.data?.token, user: refreshResult.data?.user}))
            result = await baseQuery(args, api, extraOptions)
        }
        if(refreshResult?.error){
            api.dispatch(clearCredentials())
            // await baseQuery("/signout", {}, {})
        }
    }
    return result
}

export default baseQueryWithReAuth
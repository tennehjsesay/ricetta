import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Signin from './Signin'
import Signup from './Signup'
import { fetchBaseQuery, skipToken } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector } from 'react-redux'
import { clearCredentials, setCredentials } from './redux/auth/authSlice'
import Profile from './Profile'
import { useGetUserQuery } from './redux/user/userApi'
import { setUser } from './redux/user/userSlice'
import EditProfile from './EditProfile'
import ProtectedRoute from './components/ProtectedRoute'
import RecipeDetail from './RecipeDetail'
import Recipes from './Recipes'
import { LoaderCircle } from 'lucide-react'

function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  // REFRESH ACCESSTOKEN ON RELOAD
  useEffect(() => {
    const fetchAccessToken = async () => {
      const rawBaseQuery = fetchBaseQuery({
        baseUrl: "https://ricettaserver.onrender.com",
        credentials: "include"
      })
      try{
        const refreshResult = await rawBaseQuery("/refresh", {}, {})
        if(refreshResult?.data){
          dispatch(setCredentials({user: refreshResult.data?.user, token: refreshResult.data?.token}))
          setIsLoading(false)
        } 
        if(refreshResult?.error){
          setIsLoading(false)
          dispatch(clearCredentials())
          return
        } 
      }catch(err) {
        console.log(err)
      }
    }
    fetchAccessToken()
  }, [dispatch])

  // FETCH & ADD USER TO STORE
  const authUser = useSelector((state) => state.authSlice.user)
  const {data, isSuccess} = useGetUserQuery(authUser?.id ?? skipToken)
  useEffect(() => {
    if(isSuccess){
      dispatch(setUser(data))
    }
  }, [data, isSuccess, dispatch]);

  if(isLoading) return <main className='h-[80vh] flex items-center justify-center'>
    <LoaderCircle className='animate-spin text-pri' />
  </main>

  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/signin' element={<Signin />}/>
      <Route path='/signin/:token' element={<Signin />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route element={<ProtectedRoute />}>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/edit-profile' element={<EditProfile />}/>
        <Route path='/recipe/:id' element={<RecipeDetail />}/>
        <Route path='/recipes' element={<Recipes />}/>
      </Route>
    </Routes>
  )
}

export default App

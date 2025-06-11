import { Link } from 'react-router-dom'
import Header from './components/Header'
import { useSelector, useDispatch } from 'react-redux'
import { skipToken } from '@reduxjs/toolkit/query'
import { useDeleteFavoriteMutation, useGetFavoritesQuery } from './redux/favorites/favoriteApi'
import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'

const Profile = () => {
    const [deleteFavorite] = useDeleteFavoriteMutation()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.userSlice.user)
    const [recipes, setRecipes] = useState([])
    const [isDeleting, setIsDeleting] = useState({status: false, id: ""})
    const [isLoading, setIsLoading] = useState(true)
    const getFavorites = useGetFavoritesQuery(user?._id || skipToken)
    

    useEffect(() => {
        if(getFavorites?.data){
            setIsLoading(false)
            setRecipes(getFavorites?.data)
        }
    }, [getFavorites, dispatch])

    const handleFavoriteDelete = async (id) => {
        try{
            setIsDeleting({status: true, id})
            const deleteResponse = await deleteFavorite(id)
            if(deleteResponse){
                setIsDeleting({status: false, id: ""})
            }
        } catch(err){
            setIsDeleting({status: false, id: ""})
            console.log(err)
        }

    }

    return (
        <>
            <Header />
            <main style={{minHeight: "calc(100vh - 56px)"}} className='min-h-screen flex flex-col items-center p-3'>
                <img src={user?.imageUrl || "/profile.jpg"} alt="" className='w-20 h-20 object-cover object-top rounded-full mt-2'/>
                <p className='font-bold'>{user?.firstname} {user?.lastname}</p>
                <p className='text-sm'>{user?.email}</p>
                <Link to="/edit-profile" className='bg-pri text-white p-2 rounded-sm font-bold mt-2 text-[0.9rem] hover:opacity-95 active:opacity-90 cursor-pointer transition-all'>
                    Edit Profile
                </Link>
                <div className='flex flex-col mt-2 border-b-[0.2px] border-[#ddd]'>
                {(!isLoading && recipes) && <h2 className='font-bold'>Favorites</h2>}
                {isLoading ? <LoaderCircle className='text-pri animate-spin' /> : recipes?.map(recipe => 
                    <div  key={recipe.recipeId} className='p-2 flex gap-2 items-center border-t-[0.2px] inset-shadow-sm border-[#ddd] overflow-hidden'>
                        {recipe.image && <div className='shrink-0'>
                            <img src={recipe.image} className='w-15 h-15 object-cover rounded-md'/>
                        </div>}
                        <div className='flex flex-col text-[0.84rem] items-start gap-1'>
                            <p className='font-bold whitespace-nowrap w-70 text-ellipsis overflow-hidden'>{recipe.title}</p>
                            <div className='flex gap-1'>
                                <Link to={`/recipe/${recipe.recipeId}`} className='text-[0.9rem] bg-pri text-white py-1 px-2 rounded-sm hover:opacity-95 active:opacity-90'>Details</Link>
                                <button onClick={() => handleFavoriteDelete(recipe._id)} className='text-[0.9rem] bg-red-500 text-white py-1 px-2 rounded-sm hover:opacity-95 active:opacity-90 flex justify-center w-15'>{(isDeleting.status === true && isDeleting.id === recipe._id) ? <LoaderCircle className='animate-spin' size={20}/> : "Delete"}</button>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </main>
        </>
    )
}

export default Profile
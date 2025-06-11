import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useGetRecipeQuery } from './redux/recipes/recipeApi';
import Header from './components/Header';
import { LoaderCircle } from 'lucide-react';
import { useAddFavoriteMutation } from './redux/favorites/favoriteApi';
import { useSelector } from 'react-redux';
import { useGetFavoritesQuery } from './redux/favorites/favoriteApi';
import { skipToken } from '@reduxjs/toolkit/query';

const RecipeDetail = () => {
    const [addToFavorite] = useAddFavoriteMutation()
    const [recipe, setRecipe] = useState(null)
    const [isAdding, setIsAdding] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [favorites, setFavorites] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { id } = useParams();
    const instructionRef = useRef();
    const recipeResult = useGetRecipeQuery(id);
    const user = useSelector((state) => state.userSlice.user);

    const getFavorites = useGetFavoritesQuery(user?._id || skipToken)
    
    useEffect(() => {
        if(getFavorites?.data){
            setFavorites(getFavorites?.data)
        }
    }, [getFavorites])

    useEffect(() => {
    if (
        recipeResult?.data &&
        recipeResult.data.instructions &&
        instructionRef.current
    ) {
        setIsLoading(false)
        if(favorites){
            favorites.map(favorite => {
                if (recipeResult?.data.id === favorite.recipeId) {
                    setIsFavorite(true)
                }
            })
        }
        if(!recipeResult.data.instructions.includes("</li><li>")){
            instructionRef.current.classList.add("rubbish-rubbish")
        }
        instructionRef.current.innerHTML = recipeResult.data.instructions;
        setRecipe(recipeResult.data);
    }
    }, [recipeResult, favorites]);


    const addToFavorites = async () => {
        const recipeData = {
            userId: user?._id,
            recipeId: recipe.id,
            image: recipe.image,
            title: recipe.title
        }
        try{
            setIsAdding(true)
            const addResponse = await addToFavorite(recipeData)
            if(addResponse?.data || addResponse.error){
                setIsAdding(false)
            }
        } catch (err){
            setIsAdding(false)
            console.log(err)
        }
    }

    return (
        <>  <div className='fixed left-0 right-0 top-0'>
                <Header />
            </div>
            <main className='p-3 flex flex-col bg items-center mb-12 md:mb-14 gap-2 pt-15'>
                <h2 className='font-caveat text-center text-lg font-black'>{recipe?.title}</h2>
                {!isLoading && <div className='flex gap-2 max-w-lg'>
                    <img src={recipe?.image} alt="" className='w-30 h-30 object-cover rounded-md'/>
                    <div className='flex flex-col gap-1 text-[0.9rem]'>
                        <p className='-mt-1'><span className='font-bold'>Duration:</span> {recipe?.readyInMinutes} minutes</p>
                        <p className='-mt-1'><span className='font-bold'>Vegetarian:</span> {recipe?.vegetarian ? "Yes" : "No"}</p>
                        <p className='-mt-1'><span className='font-bold'>Vegan:</span> {recipe?.vegan ? "Yes" : "No"}</p>
                        <p className='-mt-1'><span className='font-bold'>Price per serving:</span> ${recipe?.pricePerServing}</p>
                        <div className='w-fit px-2 h-7 bg-[#191971] rounded-md flex gap-1 items-center font-bold justify-center text-white text-[0.7rem]'>
                            <span className='font-bold'>Likes:</span>{recipe?.aggregateLikes}
                        </div>
                    </div>
                </div>}
                <div className='flex flex-col items-center mt-1'>
                    {!isLoading && <h3 className='font-bold text-[0.9rem] border-[1px] w-full text-center border-[#333] border-b-0 rounded-t-md'>Instructions</h3>}
                    <div ref={instructionRef} className='text-[1rem] instruction max-w-lg'>
                    </div>
                </div>
                {recipe && <button onClick={addToFavorites} className='font-black font-caveat text-xl fixed bottom-3 bg-pri text-white py-2 px-3 rounded-md hover:opacity-95 active:opacity-95 transition-all flex items-center justify-center w-36 disabled:bg-gray-500 cursor-pointer' disabled={isFavorite}>{isAdding ? <LoaderCircle className='animate-spin'/> : "Add to Favorites"}</button>}
            </main>
            {isLoading && <div className='h-[20vh] flex items-center justify-center'>
                <LoaderCircle className='animate-spin text-pri' />
            </div>}
        </>
    )
}

export default RecipeDetail
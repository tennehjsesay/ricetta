import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import { useHomeRecipesQuery } from './redux/recipes/recipeApi'
import { Link } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'

const Home = () => {
    const randomRecipes = useHomeRecipesQuery()
    const [isLoading, setIsLoading] = useState(true)
    const [recipes, setRecipes] = useState(null)
    useEffect(() => {
        if(randomRecipes?.data){
            setIsLoading(false)
            setRecipes(randomRecipes?.data.recipes)
        }
        if(randomRecipes?.error){
            setIsLoading(false)
        }
    }, [randomRecipes])

    return (
        <div className='flex justify-center'>  
            <div className='fixed left-0 right-0 top-0'>
                <Header />
                <div className='p-4 relative h-[30vh] md:h-[35vh] bg-pri'>
                    <div className="before:content-[''] before:absolute before:inset-0 before:bg-[url('/burger.jpeg')] before:bg-cover before:bg-center before:opacity-30"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                        <h2 className='font-caveat text-5xl font-black'>Ricetta</h2>
                        <p className='font-caveat text-xl font-extrabold -mt-1'>The home of mouth watering</p>
                        <p className='text-[0.9rem] -mt-1 font-medium'>recipes for you and your loved ones!</p>
                        <Link to="/recipes" className='text-[0.9rem] bg-white text-pri py-1 px-2 rounded-sm'>
                            Recipes
                        </Link>
                    </div>
                </div>
            </div>

            <main className='home-main w-full max-w-lg flex flex-col items-center'>
                <div className='flex flex-col w-full'>
                    {isLoading ? <div className='h-[20vh] flex items-center justify-center'>
            <LoaderCircle className='animate-spin text-pri' />
        </div> : recipes?.map(recipe => 
                        <div  key={recipe.id} className='md:p-3 p-2 flex gap-2 items-center inset-shadow-sm border-b-[0.2px] border-[#ddd] overflow-hidden'>
                            {recipe.image && <div className='shrink-0'>
                                <img src={recipe.image} className='w-15 h-15 object-cover rounded-md'/>
                            </div>}
                            <div className='flex flex-col text-[0.84rem] items-start'>
                                <p className='font-bold whitespace-nowrap w-70 text-ellipsis overflow-hidden'>{recipe.title}</p>
                                <p className='-mt-1'><span className='font-bold'>Duration:</span> {recipe.readyInMinutes} minutes</p>
                                <Link to={`/recipe/${recipe.id}`} className='text-[0.9rem] bg-pri text-white py-1 px-2 rounded-sm hover:opacity-95 active:opacity-90'>Details</Link>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}

export default Home
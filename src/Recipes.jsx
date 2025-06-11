import { useEffect, useState } from 'react'
import Header from './components/Header'
import { useGetPageRecipesQuery } from './redux/recipes/recipeApi'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LoaderCircle } from 'lucide-react'

const Recipes = () => {
    const [offset, setOffset] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const pageRecipes = useGetPageRecipesQuery(offset)
    const [recipes, setRecipes] = useState(null)
    useEffect(() => {
        if(pageRecipes?.data){
            setIsLoading(false)
            setRecipes(pageRecipes?.data.recipes)
        }
    }, [pageRecipes])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <>  
            <div className='fixed left-0 right-0 top-0 z-10'>
                <Header />
            </div>

            <main className='w-full md:flex md:justify-center pt-14'>
                <div className='flex flex-col w-full max-w-md relative'>
                    {isLoading ? <div className='h-[20vh] flex items-center justify-center'>
                                <LoaderCircle className='animate-spin text-pri' />
                            </div> : recipes?.map(recipe => 
                        <div  key={recipe.id} className='p-2 flex gap-2 items-center border-b-[0.2px] inset-shadow-sm border-[#ddd] overflow-hidden'>
                            {recipe.image && <div className='shrink-0'>
                                <img src={recipe.image} className='w-15 h-15 object-cover rounded-md'/>
                            </div>}
                            <div className='flex flex-col text-[0.84rem] items-start gap-1'>
                                <p className='font-bold whitespace-nowrap w-70 text-ellipsis overflow-hidden'>{recipe.title}</p>
                                <Link to={`/recipe/${recipe.id}`} className='text-[0.9rem] bg-pri text-white py-1 px-2 rounded-sm hover:opacity-95 active:opacity-90'>Details</Link>
                            </div>
                        </div>
                    )}
                    <div className='fixed bottom-2 right-2 flex flex-col gap-2'>
                        <button className='bg-pri text-white rounded-full flex items-center justify-center p-3 hover:opacity-95 cursor-pointer active:opacity-95 transition-all disabled:bg-gray-400' disabled={offset === 0 ? true : false} onClick={() => {setIsLoading(true); setOffset(prev => prev - 10); scrollToTop()}}>
                            <ChevronLeft size={30}/>
                        </button>
                        <button className='bg-pri text-white rounded-full flex items-center justify-center p-3 hover:opacity-95 cursor-pointer active:opacity-95 transition-all' onClick={() => {setIsLoading(true); setOffset(prev => prev + 10); scrollToTop()}}>
                            <ChevronRight size={30}/>
                        </button>
                    </div>
                </div>

            </main>
        </>
    )
}

export default Recipes
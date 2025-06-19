import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSignOutMutation } from '../redux/auth/authApi'
import { clearCredentials } from '../redux/auth/authSlice'
import { LoaderCircle } from 'lucide-react'

const Header = () => {
    const [signOut] = useSignOutMutation()
    const navigate = useNavigate("/")
    const dispatch = useDispatch()
    const location = useLocation()
    const user = useSelector((state) => state.authSlice)
    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleSignOut = async () => {
        try{
            setIsSigningOut(true)
            const result = await signOut();
            if(result.data){
                dispatch(clearCredentials())
                setIsSigningOut(false)
                navigate("/")
            }
            if(result.error){
                setIsSigningOut(false)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <header className='bg-pri py-2 px-3 h-14 flex items-center justify-between'>
            <Link to="/" className='flex cursor-pointer hover:opacity-95 active:opacity-90 transition-all'>
                <img src="/chicken.png" alt="" className='w-10'/>
                <h1 className='font-caveat font-black text-white text-lg'>Ricetta</h1>
            </Link>
            <div className='flex items-center gap-3'>
                {user.user ? <>{location.pathname !== "/profile" && <Link to="/profile" className='text-white font-bold cursor-pointer hover:opacity-90 transition-all'>Profile</Link>}
                <button onClick={handleSignOut} className='bg-white py-1 px-2 rounded-sm text-pri w-18 flex justify-center cursor-pointer hover:opacity-90 transition-all'>{isSigningOut ? <LoaderCircle className='animate-spin'/> : "Signout"}</button></> : (location.pathname === "/signin" || location.pathname === "/signup") ? "" : <Link to="/signin" className='bg-white py-1 px-2 rounded-sm cursor-pointer hover:opacity-90 transition-all'>Signin</Link>}
            </div>
        </header>
    )
}

export default Header
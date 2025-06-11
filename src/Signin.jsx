import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSignInMutation, useVerifyEmailQuery } from './redux/auth/authApi'
import { skipToken } from '@reduxjs/toolkit/query'
import { useDispatch } from 'react-redux'
import { setCredentials } from './redux/auth/authSlice'
import { LoaderCircle } from 'lucide-react'
import Header from './components/Header'

const Signin = () => {
    const [signIn] = useSignInMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [formState, setFormState] = useState({
        email: "",
        password: ""
    })

    // CHECK FOR VERIFICATION TOKEN
    const {token} = useParams()
    const verifyResult = useVerifyEmailQuery(token ?? skipToken)
    useEffect(() => {
        if(verifyResult.isError){
            setErrMsg("Unable to verify account!")
        }
        if(verifyResult.isSuccess){
            setSuccessMsg(verifyResult.currentData.message)
        }
    }, [verifyResult])
    


    // ERROR MESSAGE USEEFFECT
    useEffect(() => {
        const errMsgTimeout = setTimeout(() => {
            setErrMsg(null)
        }, 5000)
        return () => clearTimeout(errMsgTimeout)
    }, [errMsg])

    // SUCCESS MESSAGE USEEFFECT
    useEffect(() => {
        const successMsgTimeout = setTimeout(() => {
            setSuccessMsg(null)
        }, 5000)
        return () => clearTimeout(successMsgTimeout)
    }, [successMsg])

    // FORMSTATE UPDATE FUNCTION
    const handleFormState = (e) => {
        setFormState({...formState, [e.target.name]: e.target.value})
    }

    // FORM SUBMIT FUNCTION
    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            setIsSigningIn(true)
            const result = await signIn(formState)
            if(result?.data){
                setIsSigningIn(false)
                dispatch(setCredentials({token: result.data.token, user: result.data.user}))
                navigate("/")
            }
            if(result?.error){
                setIsSigningIn(false)
                setErrMsg(result.error.data.message)
            }
        } catch (err) {
            setIsSigningIn(false)
            setErrMsg(err.message)
        }
    }

    return (
        <>
        <Header />
        <main style={{height: "calc(100vh - 56px)"}} className='w-full flex flex-col justify-center items-center py-4 px-5 relative bg-pri'>
            <div className="before:content-[''] before:absolute before:inset-0 before:bg-[url('/burger.jpeg')] before:bg-cover before:bg-center before:opacity-40"></div>
            <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col w-full max-w-[400px] gap-1 bg-[#fff] py-4 px-5 rounded-md border border-[#dddddd] shadow-sm relative'>
                <img src="/chicken.png" alt="chicken-png" className='w-34 absolute -top-8 -right-2'/>
                <h1 className='text-xl font-caveat text-left pl-1 z-10'>Signin to <span className='font-bold'>Ricetta</span></h1>
                <div className='flex flex-col text-[0.9rem]'>
                    <label htmlFor="email" className='ml-2'>Email*</label>
                    <input required type="email" name='email' placeholder='Email' value={formState.email} onChange={(e) => handleFormState(e)} className='border border-[#dddddd] inset-shadow-sm px-3 py-2  rounded-md outline-none w-full'/>
                </div>
                <div className='flex flex-col text-[0.9rem]'>
                    <label htmlFor="password" className='ml-2'>Password*</label>
                    <input required type={showPassword ? "text" : "password"} name='password' placeholder='Password' value={formState.password} onChange={(e) => handleFormState(e)} className='border border-[#dddddd] inset-shadow-sm px-3 py-2  rounded-md outline-none w-full'/>
                </div>
                <div className='flex justify-between items-end text-[0.9rem] px-1'>
                    <div className='flex items-center gap-1 mt-1'>
                        <input type="checkbox" name="showpassword" id="showpassword"  onChange={() => setShowPassword(prev => !prev)}/>
                        <label htmlFor="showpassword">Show password</label>
                    </div>
                </div>
                {errMsg && <p className='text-center text-[0.9rem] p-2 border-2 border-red-700 text-red-700 bg-red-200 rounded-sm font-semibold'>{errMsg}</p>}
                {successMsg && <p className='text-center text-[0.9rem] p-2 border-2 text-green-700 border-green-700 bg-green-200 rounded-md font-semibold'>{successMsg}</p>}
                <button type='submit' className='bg-pri text-white p-2 rounded-md fot-bold mt-1 transition-all hover:opacity-90 flex justify-center cursor-pointer'>
                    {isSigningIn? <LoaderCircle className='animate-spin' /> : "Signin"}
                </button>
                <div className='text-[0.9rem] flex gap-1 justify-center'>
                    <p>Don't have an account?</p>
                    <Link to="/signup" className='font-black'>Signup</Link>
                </div>
            </form>
        </main>
        </>
    )
}

export default Signin
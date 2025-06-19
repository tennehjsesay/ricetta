import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSignUpMutation } from './redux/auth/authApi'
import Header from './components/Header';

const Signup = () => {
    const [signUp] = useSignUpMutation();
    const [showPassword, setShowPassword] = useState(false)
    const [passwordMatches, setPasswordMatches] = useState(true)
    const [errMsg, setErrMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [formState, setFormState] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: ""
    })

    // PASSWORD MATCH USEEFFECT
    useEffect(() => {
        if(formState.password === formState.confirmpassword){
            setPasswordMatches(true)
        }else {
            setPasswordMatches(false)
        }
    }, [formState.password, formState.confirmpassword])

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
        if(formState.password !== formState.confirmpassword){
            setErrMsg("Passwords don't match!")
            return
        }
        const userData = {
            firstname: formState.firstname, 
            lastname: formState.lastname, 
            email: formState.email, 
            password: formState.password
        }
        try{
            const result = await signUp(userData);
            if(result?.data){
                setSuccessMsg(result.data.message)
            }
            if(result?.error){
                setSuccessMsg(result.error.data.message)
            }
        } catch (err) {
            errMsg(err.message)
        }
    }

    return (
        <>
        <Header />
        <main style={{height: "calc(100vh - 56px)"}}  className='w-full h-[93vh] flex flex-col items-center justify-center py-4 px-5 bg-pri relative'>
            <div className="before:content-[''] before:absolute before:inset-0 before:bg-[url('/burger.jpeg')] before:bg-cover before:bg-center before:opacity-40"></div>
            <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col w-full gap-1 bg-[#fff] py-4 px-5 rounded-md border border-[#dddddd] shadow-sm relative max-w-[400px]'>
                <img src="/chicken.png" alt="chicken-png" className='w-34 absolute -top-8 -right-2'/>
                <h1 className='text-xl font-caveat text-left pl-1 z-10'>Signup to <span className='font-bold'>Ricetta</span></h1>
                <div className='flex flex-col text-[0.9rem]'>
                    <label htmlFor="firstname" className='ml-2'>Firstname*</label>
                    <input required type="text" name='firstname' placeholder='Firstname' value={formState.firstname} onChange={(e) => handleFormState(e)} className='border border-[#dddddd] inset-shadow-sm px-3 py-2  rounded-md outline-none w-full'/>
                </div>
                <div className='flex flex-col text-[0.9rem]'>
                    <label htmlFor="lastname" className='ml-2'>Lastname*</label>
                    <input required type="text" name='lastname' placeholder='Lastname' value={formState.lastname} onChange={(e) => handleFormState(e)} className='border border-[#dddddd] inset-shadow-sm px-3 py-2  rounded-md outline-none w-full'/>
                </div>
                <div className='flex flex-col text-[0.9rem]'>
                    <label htmlFor="email" className='ml-2'>Email*</label>
                    <input required type="email" name='email' placeholder='Email' value={formState.email} onChange={(e) => handleFormState(e)} className='border border-[#dddddd] inset-shadow-sm px-3 py-2  rounded-md outline-none w-full'/>
                </div>
                <div className='flex flex-col text-[0.9rem]'>
                    <label htmlFor="password" className='ml-2'>Password*</label>
                    <input required type={showPassword ? "text" : "password"} name='password' placeholder='Password' value={formState.password} onChange={(e) => handleFormState(e)} className='border border-[#dddddd] inset-shadow-sm px-3 py-2  rounded-md outline-none w-full'/>
                </div>
                <div className='flex flex-col text-[0.9rem] '>
                    <label htmlFor="confirmpassword" className='ml-2'>Confirm password*</label>
                    <input required type={showPassword ? "text" : "password"} name='confirmpassword' placeholder='Confirm password' value={formState.confirmpassword} onChange={(e) => handleFormState(e)} className='border border-[#dddddd] inset-shadow-sm px-3 py-2  rounded-md outline-none w-full'/>
                </div>
                <div className='flex justify-between items-end text-[0.9rem] px-1'>
                    <div className='flex items-center gap-1 mt-1'>
                        <input type="checkbox" name="showpassword" id="showpassword"  onChange={() => setShowPassword(prev => !prev)}/>
                        <label htmlFor="showpassword">Show password</label>
                    </div>
                    {(formState.password === "" && formState.confirmpassword === "") ? <></> : <>{passwordMatches && <p className='font-bold text-green-800'>
                        Matches
                    </p>}</>}
                </div>
                {errMsg && <p className='text-center text-[0.9rem] p-2 border-2 border-red-700 bg-red-200 rounded-sm font-semibold'>{errMsg}</p>}
                {successMsg && <p className='text-center text-[0.9rem] p-2 border-2 border-green-700 bg-green-200 rounded-md font-semibold'>{successMsg}</p>}
                <button type='submit' className='bg-pri text-white p-2 rounded-md fot-bold mt-1 transition-all hover:opacity-90 cursor-pointer'>
                    Signup
                </button>
                <div className='text-[0.9rem] flex gap-1 justify-center'>
                    <p>Already have an account?</p>
                    <Link to="/signin" className='font-black'>Signin</Link>
                </div>
            </form>
        </main>
        </>
    )
}

export default Signup
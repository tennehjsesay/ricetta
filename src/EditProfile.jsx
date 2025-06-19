import Header from './components/Header'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useUpdateUserMutation } from './redux/user/userApi'
import { LoaderCircle } from 'lucide-react'


const EditProfile = () => {
    const [updateUser] = useUpdateUserMutation()
    const navigate = useNavigate()
    const ppRef = useRef()
    const user = useSelector((state) => state.userSlice.user)
    const [isUpdating, setIsUpdating] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [formState, setFormState] = useState({
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        profilephoto: user?.profilephoto || ""
    })

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
        if(e.target.name === "profilephoto"){
            const url = URL.createObjectURL(e.target.files?.[0])
            ppRef.current.src = url
            setFormState({...formState, profilephoto: e.target.files?.[0]})
            return
        }
        setFormState({...formState, [e.target.name]: e.target.value})
    }    

    // FORM SUBMIT FUNCTION
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("firstname", formState.firstname)
        formData.append("lastname", formState.lastname)
        formData.append("profilephoto", formState.profilephoto)
        formData.append("id", user?._id ?? "")
        try{
            setIsUpdating(true)
            const result = await updateUser(formData)
            if(result?.data){
                setIsUpdating(false)
                navigate("/profile")
            }
            if(result?.error){
                setIsUpdating(false)
                setErrMsg(result.error.data.message)
            }
        } catch (err) {
            setIsUpdating(false)
            setErrMsg(err.message)
        }
    }    

    return (
        <>
            <Header />
            <main className='w-full h-[93vh] flex flex-col justify-center items-center py-4 px-5 relative bg-pri'>
                <div className='before:content-[""] before:absolute before:inset-0 before:bg-[url("/burger.jpeg")] before:bg-cover before:bg-center before:opacity-40'></div>
                <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col w-full gap-1 bg-[#fff] py-4 px-5 rounded-md border border-[#dddddd] shadow-sm relative max-w-[350px]'>
                    <h1 className='text-xl font-caveat text-center pl-1 z-10'>Edit <span className='font-bold'>Ricetta</span> Profile</h1>
                    <div className='flex flex-col text-[0.9rem] items-center'>
                        <img src={user?.imageUrl || "/profile.jpg"} ref={ppRef} className='w-20 h-20 object-cover object-top rounded-full mb-1'/>
                        <label htmlFor="profilephoto" className='ml-2 bg-pri text-white p-2 rounded-md fot-bold mt-1 transition-all hover:opacity-90 flex justify-center '>Choose Image</label>
                        <input type="file" name='profilephoto' id="profilephoto" placeholder='Profilephoto' onChange={(e) => handleFormState(e)} className='hidden'/>
                    </div>
                    <div className='flex flex-col text-[0.9rem]'>
                        <label htmlFor="firstname" className='ml-2'>Firstname*</label>
                        <input required type="firstname" name='firstname' placeholder='Firstname' value={formState.firstname} onChange={(e) => handleFormState(e)} className='border border-[#dddddd] inset-shadow-sm px-3 py-2  rounded-md outline-none w-full'/>
                    </div>
                    <div className='flex flex-col text-[0.9rem]'>
                        <label htmlFor="lastname" className='ml-2'>Lastname*</label>
                        <input required type="lastname" name='lastname' placeholder='Lastname' value={formState.lastname} onChange={(e) => handleFormState(e)} className='border border-[#dddddd] inset-shadow-sm px-3 py-2  rounded-md outline-none w-full'/>
                    </div>
                    {errMsg && <p className='text-center text-[0.9rem] p-2 border-2 border-red-700 text-red-700 bg-red-200 rounded-sm font-semibold'>{errMsg}</p>}
                    {successMsg && <p className='text-center text-[0.9rem] p-2 border-2 text-green-700 border-green-700 bg-green-200 rounded-md font-semibold'>{successMsg}</p>}
                    <button type='submit' className='bg-pri text-white p-2 rounded-md fot-bold mt-1 transition-all hover:opacity-90 flex justify-center'>
                        {isUpdating? <LoaderCircle className='animate-spin' /> : "Update"}
                    </button>
                </form>
            </main>
        </>
    )
}

export default EditProfile
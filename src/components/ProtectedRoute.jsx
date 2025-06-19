import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header';
import { LoaderCircle } from 'lucide-react';

const ProtectedRoute = () => {
    const { token, isAuthLoading } = useSelector((state) => state.authSlice);
    if(isAuthLoading && token) return (<>
        <Header />
        <main className='h-[85vh] flex items-center justify-center'>
            <img src='/chicken.png' className='animate-bounce w-25 text-pri' />
        </main>
    </>)
    return token ? <Outlet/> : <Navigate to="/signin"  replace/>
}

export default ProtectedRoute
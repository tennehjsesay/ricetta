import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header';
import { LoaderCircle } from 'lucide-react';

const ProtectedRoute = () => {
    const { token, isAuthLoading } = useSelector((state) => state.authSlice);
    if(isAuthLoading && token) return (<>
        <Header />
        <main className='h-[80vh] flex items-center justify-center'>
            <LoaderCircle className='animate-spin text-pri' />
        </main>
    </>)
    return token ? <Outlet/> : <Navigate to="/signin"  replace/>
}

export default ProtectedRoute
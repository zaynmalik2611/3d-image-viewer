import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'; // Import Firebase auth instance
import Loader from './Loader';

const PrivateRoute = () => {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return (
      <div className='flex flex-col justify-center h-screen'>
        <div className='flex justify-center'>
          <Loader height={'h-20'} width={'w-20'} />
        </div>
      </div>
    ); // Optional: Show loading state

  return user ? <Outlet /> : <Navigate to='/auth' />;
};

export default PrivateRoute;

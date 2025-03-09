import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'; // Import Firebase auth instance

const PrivateRoute = () => {
  // WORRY: figure out a more efficient way
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>; // Optional: Show loading state

  return user ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;

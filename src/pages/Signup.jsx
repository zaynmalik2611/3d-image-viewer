import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1 className='text-center text-2xl'>3d Image Viewer</h1>
      <div className='flex flex-col items-center justify-center h-screen'>
        {/* TODO: improve button styling */}
        <button
          onClick={handleGoogleSignIn}
          className='mt-4 bg-blue-500 text-white p-2 rounded'
        >
          Sign up with Google
        </button>
        {error && <p className='text-red-500'>{error}</p>}
      </div>
    </>
  );
};

export default SignupPage;

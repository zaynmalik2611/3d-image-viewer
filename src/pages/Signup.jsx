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
    <div className='h-screen'>
      <h1 className='text-center text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-transparent bg-clip-text drop-shadow-lg tracking-wide mb-6 h-1/12'>
        DepthView
      </h1>

      <div className='flex flex-col items-center justify-center h-10/12'>
        <button
          onClick={handleGoogleSignIn}
          className='mt-6 flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-in-out font-semibold py-2 px-6 rounded-xl cursor-pointer'
        >
          <img
            src='/assets/google-icon.svg'
            alt='Google logo'
            className='w-5 h-5'
          />
          Sign up with Google
        </button>

        {error && <p className='text-red-500'>{error}</p>}
      </div>
    </div>
  );
};

export default SignupPage;

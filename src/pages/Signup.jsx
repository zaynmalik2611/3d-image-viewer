import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h2 className='text-2xl font-bold mb-4'>Sign Up</h2>
      {error && <p className='text-red-500'>{error}</p>}
      <form onSubmit={handleSignup} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='p-2 border rounded'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='p-2 border rounded'
        />
        <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
          Sign Up
        </button>
      </form>
      <button
        onClick={handleGoogleSignIn}
        className='mt-4 bg-red-500 text-white p-2 rounded'
      >
        Sign up with Google
      </button>
    </div>
  );
};

export default SignupPage;

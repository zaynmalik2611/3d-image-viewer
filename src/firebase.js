// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDownloadURL, ref, getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD_0CeBhkoEmNOwFBFFxejr6GffhlY6BXY',
  authDomain: 'd-images-2dbbf.firebaseapp.com',
  projectId: 'd-images-2dbbf',
  storageBucket: 'd-images-2dbbf.firebasestorage.app',
  messagingSenderId: '105334748164',
  appId: '1:105334748164:web:16c33fc4bad16ad164f151',
  measurementId: 'G-9PKCCR9S2J',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export { storage, ref, getDownloadURL };

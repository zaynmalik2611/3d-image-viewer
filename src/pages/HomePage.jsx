import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import ImagesGrid from '../components/ImagesGrid';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Toaster, toast } from 'sonner';

function HomePage() {
  const [files, setFiles] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [user, loading] = useAuthState(auth);
  const [lastSnapShot, setLastSnapShot] = useState(null);
  const [doFetch, setDoFetch] = useState(0);
  const [showFetchMore, setShowFetchMore] = useState(true);

  const getImagesNameFromFirebase = async () => {
    try {
      // LEARN: learn firebase syntax and how it works

      const q = lastSnapShot
        ? query(
            collection(db, 'files'),
            orderBy('uploadedAt', 'desc'),
            startAfter(lastSnapShot),
            limit(9)
          )
        : query(
            collection(db, 'files'),
            orderBy('uploadedAt', 'desc'),
            limit(9)
          );
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (querySnapshot.empty) {
        setShowFetchMore(false);
        return [];
      }
      setLastSnapShot(lastVisible);
      const likesSnap = await getDoc(doc(db, 'userLikes', user?.uid));
      const likedFiles = likesSnap.exists() ? likesSnap.data().likedFiles : [];
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isLiked: likedFiles.includes(doc.id),
      }));
      return data;
    } catch (error) {
      void error;
      toast.error('An error occurred while fetching images');
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      // loading is actually auth status loading
      if (loading || !user) return;
      const filesFromStorage = await getImagesNameFromFirebase();
      setFiles([...files, ...filesFromStorage]);
      setisLoading(false);
    })();
  }, [loading, user, doFetch]);

  return (
    <div>
      <div className='grid grid-cols-3 items-center px-6 py-3 bg-white text-gray-900'>
        <div className='flex justify-start'>
          <Link to='/dashboard'>
            <span className='text-gray-900 font-semibold text-lg hover:bg-gray-100 px-3 py-1 rounded-md transition'>
              Dashboard
            </span>
          </Link>
        </div>
        <h1 className=' text-center text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-transparent bg-clip-text drop-shadow-lg tracking-wide  '>
          DepthView
        </h1>
      </div>

      <ImagesGrid isLoading={isLoading} files={files} userId={user?.uid} />
      {showFetchMore && (
        <div className='flex justify-center my-4'>
          <button
            onClick={() => setDoFetch((doFetch) => doFetch + 1)}
            className='bg-gray-800 text-white cursor-pointer rounded-md p-4'
          >
            Fetch More
          </button>
        </div>
      )}

      <Toaster position='top-right' />
    </div>
  );
}

export default HomePage;

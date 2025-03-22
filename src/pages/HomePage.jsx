import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import ImagesGrid from '../components/ImagesGrid';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Toaster, toast } from 'sonner';

function HomePage() {
  const [files, setFiles] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [user, loading] = useAuthState(auth);

  const getImagesNameFromFirebase = async () => {
    try {
      // LEARN: learn firebase syntax and how it works
      const querySnapshot = await getDocs(collection(db, 'files'));
      const likesSnap = await getDoc(doc(db, 'userLikes', user?.uid));
      console.log('likesSnap', likesSnap);
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
      if (loading || !user) return;
      const filesFromStorage = await getImagesNameFromFirebase();
      setFiles(filesFromStorage);
      setisLoading(false);
    })();
  }, [loading, user]);
  console.log('files', files);
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
        <h1 className='text-center text-2xl font-extrabold tracking-wide'>
          3D Viewer App
        </h1>
        <div />
      </div>

      {/* TODO: limit the image showing to 9 images */}
      {/* TODO: load more images by moving to the end of the page */}

      <ImagesGrid isLoading={isLoading} files={files} userId={user?.uid} />
      <Toaster position='top-right' />
    </div>
  );
}

export default HomePage;

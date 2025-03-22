import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import ImagesGrid from '../components/ImagesGrid';
import { useAuthState } from 'react-firebase-hooks/auth';

function HomePage() {
  const [files, setFiles] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [user] = useAuthState(auth);

  const getImagesNameFromFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'files'));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data;
    } catch (error) {
      // TODO: add a toast to inform that the images were not imported
      console.error('Error fetching images:', error);
      return [];
    }
  };
  useEffect(() => {
    (async () => {
      setisLoading(true);
      const filesFromStorage = await getImagesNameFromFirebase();
      console.log('filesFromStorage', filesFromStorage);
      setFiles(filesFromStorage);
      setisLoading(false);
    })();
  }, []);
  console.log('files', files);
  return (
    <div className='bg-gray-900 h-screen'>
      <div className='grid grid-cols-3 items-center  px-4 py-2 text-white '>
        <div className='flex justify-start'>
          <Link to='/dashboard'>
            <span className='text-white font-bold text-xl cursor-pointer transition rounded-lg'>
              Dashboard
            </span>
          </Link>
        </div>
        <h1 className='text-center text-2xl font-bold tracking-wide'>
          3D Viewer App
        </h1>
        <div />
      </div>

      {/* TODO: limit the image showing to 9 images */}
      {/* TODO: improve the design of the page */}
      {/* TODO: load more images by moving to the end of the page */}

      <ImagesGrid isLoading={isLoading} files={files} userId={user?.uid} />
    </div>
  );
}

export default HomePage;

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

function HomePage() {
  const [files, setFiles] = useState([]);

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
      const filesFromStorage = await getImagesNameFromFirebase();
      setFiles(filesFromStorage);
    })();
  }, []);
  console.log('files', files);
  return (
    <>
      <div className='grid grid-cols-3 mt-2'>
        <div className='flex justify-start pl-4'>
          <Link to='/dashboard'>
            <button className='bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-sm'>
              Dashboard
            </button>
          </Link>
        </div>
        <h1 className='text-center text-2xl'>Welcome to 3d viewer app</h1>
        <div></div>
      </div>

      {/* TODO: list all the images name from the firebase */}
      {/* TODO: show thumbnails of the images  */}
      {/* TODO: limit the image showing to 10 images */}
      {/* TODO: load more images by moving to the end of the page */}
      {/* TODO: add a loader when the images are loading */}

      <div className='grid grid-cols-2 sm:grid-cols-3 mt-8  gap-4'>
        {files.length ? (
          files.map((file, index) => (
            <div className='flex justify-center' key={index}>
              <Link to={`/models/${file.fileName}`} className='flex flex-col'>
                <img
                  src={file.thumbnailUrl || '/public/assets/thumbnail.jpg'}
                  className='w-44 h-44'
                />
                <span className='underline text-blue-600 hover:text-blue-400'>
                  {file.fileName}
                </span>
              </Link>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default HomePage;

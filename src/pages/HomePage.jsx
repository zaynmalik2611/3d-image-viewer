import { listAll, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { storage } from '../firebase';
import { Link } from 'react-router-dom';

function HomePage() {
  const [fileNames, setFileNames] = useState([]);

  const getImagesNameFromFirebase = async () => {
    const storageRef = ref(storage, '/');
    try {
      const result = await listAll(storageRef);
      const imageNames = result.items.map((item) => item.name);
      return imageNames;
    } catch (error) {
      // TODO: add a toast to inform that the images were not imported
      console.error('Error fetching images:', error);
      return [];
    }
  };
  useEffect(() => {
    (async () => {
      const fileNamesFromStorage = await getImagesNameFromFirebase();
      setFileNames(fileNamesFromStorage);
    })();
  }, []);
  return (
    <>
      <h1>Welcome to 3d viewer app</h1>
      {/* TODO: list all the images name from the firebase */}
      {fileNames.length ? (
        fileNames.map((fileName, index) => (
          <Link key={index} to={`/models/${fileName}`}>
            {fileName}
          </Link>
        ))
      ) : (
        <></>
      )}
    </>
  );
}

export default HomePage;

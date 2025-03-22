import React, { useEffect, useState } from 'react';
import UploadModel from '../components/UploadModel';
import { db, auth, ref, storage } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { deleteObject } from 'firebase/storage';
import { getAuth, signOut } from 'firebase/auth';

function UserDashboard() {
  const [userFiles, setUserFiles] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const listUserFiles = async () => {
    const { currentUser } = auth;

    setUser(currentUser);
    if (!currentUser) {
      console.error('User not logged in');
      navigate('/auth');
      return;
    }

    const q = query(
      collection(db, 'files'),
      where('userId', '==', currentUser.uid)
    );

    try {
      const querySnapshot = await getDocs(q);
      const files = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserFiles(files);
      return;
    } catch (error) {
      console.error('Error fetching user files:', error);
    }
  };

  const handleDeleteFile = async (file) => {
    try {
      await deleteDoc(doc(db, 'files', file.id));
      // Delete from Firebase Storage
      const fileRef = ref(storage, `/${file.modelName}`);
      await deleteObject(fileRef);

      const thumbnailRef = ref(
        storage,
        `/thumbnails/${file.thumbnailFileName}`
      );
      await deleteObject(thumbnailRef);
      // Delete metadata from Firestore

      setRefresh((refresh) => refresh + 1);
      console.log('File deleted successfully');
      // Optionally update state to reflect changes
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log('User signed out');
      navigate('/auth');
      // Optionally redirect or update UI here
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  console.log('files', userFiles);

  useEffect(() => {
    (async () => {
      await listUserFiles();
    })();
  }, [refresh]);
  console.log('user', user?.photoURL);
  return (
    <>
      <div className='flex justify-between p-4 bg-gray-900'>
        <div className='flex gap-4'>
          <Link to='/'>
            <button className='text-white cursor-pointer'>Home</button>
          </Link>
          <div className='flex items-center gap-2'>
            <img
              src={user?.photoURL}
              alt='profile photo'
              className='w-5 h-5 rounded-full '
            />
            <h2 className='text-white'>{user?.displayName}</h2>
          </div>
        </div>
        <button className='text-white cursor-pointer' onClick={handleLogout}>
          Logout
        </button>
      </div>
      <UploadModel setRefresh={setRefresh} />
      <div className='p-2'>
        {/* list all files that this user has */}
        {userFiles.map((file) => (
          <div key={file.id} className='flex items-center gap-2'>
            <Link
              className='text-cyan-600 font-semibold underline'
              to={`/models/${file.id}`}
            >
              <h2>{file.fileName}</h2>
            </Link>
            <button
              className='bg-red-500 cursor-pointer text-white p-2 rounded-md'
              onClick={() => handleDeleteFile(file)}
            >
              {/* TODO add trash icon */}
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default UserDashboard;

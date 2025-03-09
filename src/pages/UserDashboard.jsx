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

function UserDashboard() {
  const [userFiles, setUserFiles] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  console.log('hello');
  const listUserFiles = async () => {
    const user = auth.currentUser;
    setUser(user);
    if (!user) {
      console.error('User not logged in');
      navigate('/auth');
      return;
    }

    const q = query(collection(db, 'files'), where('userId', '==', user.uid));

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
      // Delete from Firebase Storage
      const fileRef = ref(storage, `/${file.fileName}`);
      await deleteObject(fileRef);

      // Delete metadata from Firestore
      await deleteDoc(doc(db, 'files', file.id));
      setRefresh((refresh) => refresh + 1);
      console.log('File deleted successfully');
      // Optionally update state to reflect changes
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };
  console.log('files', userFiles);

  useEffect(() => {
    (async () => {
      await listUserFiles();
    })();
  }, [refresh]);
  return (
    <>
      {/* <h2>User: {userName}</h2> */}
      <button>Logout</button>
      <UploadModel />
      {/* list all files that this user has */}
      {userFiles.map((file) => (
        <div key={file.id}>
          <Link to={`/models/${file.fileName}`}>
            <h2>{file.fileName}</h2>
          </Link>
          <button onClick={() => handleDeleteFile(file)}>Delete</button>
        </div>
      ))}
    </>
  );
}

export default UserDashboard;

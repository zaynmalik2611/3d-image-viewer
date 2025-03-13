import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { auth, storage, db } from '../firebase';

function UploadModel() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileUpload = () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    const fileExtension = file.name
      .slice(file.name.lastIndexOf('.'))
      .toLowerCase();
    if (fileExtension !== '.glb') {
      alert('Only .glb models are allowed for now.');
      setFile(null);
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      alert('You need to be logged in to upload files.');
      return;
    }
    const storageRef = ref(storage, `/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percent);
      },
      (error) => {
        console.error('Upload error: ', error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadUrl(url);
        console.log('file available at', url);
        // Save metadata to Firestore
        try {
          await addDoc(collection(db, 'files'), {
            fileName: file.name,
            fileURL: url,
            userId: user.uid,
            uploadedAt: serverTimestamp(),
          });
          console.log('File metadata saved to Firestore.');
        } catch (error) {
          console.error('Error saving file metadata:', error);
        }
      }
    );
  };

  return (
    <>
      <div className='w-full flex justify-center items-center gap-4 mt-4'>
        <label htmlFor='model'>Upload model image (glb format)</label>
        <label className='flex items-center justify-center w-full max-w-40 px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 transition-all'>
          Choose File
          <input
            type='file'
            className='hidden'
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button
          className='bg-blue-600 text-white rounded-sm p-2'
          onClick={handleFileUpload}
        >
          Upload File
        </button>
      </div>
      <div className='flex justify-center mt-4'>
        <div className='w-full max-w-sm'>
          <div className=' bg-gray-200 rounded-full h-3'>
            <div
              className='bg-blue-600 h-3 rounded-full transition-all'
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className='text-sm text-gray-600 mt-1 text-center'>
            {progress.toFixed(2)}% uploaded
          </p>
        </div>
      </div>
    </>
  );
}

export default UploadModel;

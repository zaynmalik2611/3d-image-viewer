import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { storage } from '../firebase';

function UploadModelPage() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [progress, setProgress] = useState(0);
  console.log('file', file);
  const handleFileUpload = () => {
    if (!file) {
      alert('Please select a file first!');
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
      }
    );
  };

  return (
    <>
      <h1 className='text-4xl font-semibold text-center'>Upload Model Page</h1>
      <div className='w-full flex justify-center gap-4 mt-4'>
        <label htmlFor='model'>Upload model image (glb format)</label>
        <label className='flex items-center justify-center w-full max-w-xs px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 transition-all'>
          Choose File
          <input
            type='file'
            className='hidden'
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button
          className='bg-blue-500 text-white rounded-sm p-4'
          onClick={handleFileUpload}
        >
          Upload File
        </button>
      </div>
      <div className='w-full max-w-sm bg-gray-200 rounded-full h-3'>
        <div
          className='bg-blue-600 h-3 rounded-full transition-all'
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className='text-sm text-gray-600 mt-1'>
        {progress.toFixed(2)}% uploaded
      </p>
    </>
  );
}

export default UploadModelPage;

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import React, { useRef, useState } from 'react';
import { auth, storage, db } from '../firebase';

function UploadModel() {
  const modelViewerRef = useRef();
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [modelProgress, setModelProgress] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);

  const captureThumbnail = async () => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    try {
      const dataUrl = await viewer.toDataURL('image/png');
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'thumbnail.png', { type: 'image/png' });
      setThumbnailFile(file);
    } catch (err) {
      console.error('Capture failed:', err);
    }
  };

  const uploadWithProgress = (uploadTask, setProgress) => {
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(percent); // optional progress callback
        },
        (error) => reject(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask?.snapshot?.ref);
            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  };

  const handleFileUpload = async () => {
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

    const fileDownloadUrl = await uploadWithProgress(
      uploadTask,
      setModelProgress
    );
    const savedFileDoc = await addDoc(collection(db, 'files'), {
      fileName: file.name,
      fileURL: fileDownloadUrl,
      userId: user.uid,
      uploadedAt: serverTimestamp(),
      thumbnailUrl: '',
    });

    if (thumbnailFile) {
      const thumbStorageRef = ref(storage, `/thumbnails/${thumbnailFile.name}`);
      const thumbUploadTask = uploadBytesResumable(
        thumbStorageRef,
        thumbnailFile
      );
      const thumbnailDownloadUrl = await uploadWithProgress(
        thumbUploadTask,
        setThumbnailProgress
      );
      const docRef = doc(db, 'files', savedFileDoc.id);
      await updateDoc(docRef, {
        thumbnailUrl: thumbnailDownloadUrl,
      });
      console.log('File + thumbnail metadata saved.');
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const url = URL.createObjectURL(uploadedFile);
      modelViewerRef.current.src = url;
    }
  };

  // TODO: do styling improvements

  return (
    <>
      <div className='w-full flex justify-center items-center gap-4 mt-4'>
        <label htmlFor='model'>Upload model image (glb format)</label>
        <label className='flex items-center justify-center w-full max-w-40 px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 transition-all'>
          Choose File
          <input type='file' className='hidden' onChange={handleFileChange} />
        </label>
        <button
          className='bg-blue-600 text-white rounded-sm p-2'
          onClick={handleFileUpload}
        >
          Upload File
        </button>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div className='flex justify-end'>
          {thumbnailFile && (
            <>
              <img
                src={URL.createObjectURL(thumbnailFile)}
                alt='Thumbnail Preview'
                width={300}
                height={200}
              />
            </>
          )}
        </div>
        <div className='flex justify-center items-center'>
          {file && (
            <button
              className='p-2 rounded-sm bg-blue-500 h-10 text-white'
              onClick={captureThumbnail}
            >
              {/* TODO: replace with camera icon */}
              Capture Thumbnail
            </button>
          )}
        </div>
        <div>
          <model-viewer
            ref={modelViewerRef}
            style={{ width: 300, height: 300 }}
            camera-controls
            auto-rotate
            exposure='1'
            environment-image='neutral'
            onLoad={captureThumbnail}
            onLoadStart={() => setThumbnailFile(null)}
          />
        </div>
      </div>
      <div className='flex justify-center mt-4'>
        <div className='w-full max-w-sm'>
          <div className=' bg-gray-200 rounded-full h-3'>
            <div
              className='bg-blue-600 h-3 rounded-full transition-all'
              style={{ width: `${modelProgress}%` }}
            ></div>
          </div>
          <p className='text-sm text-gray-600 mt-1 text-center'>
            {modelProgress.toFixed(2)}% uploaded
          </p>
        </div>
      </div>
    </>
  );
}

export default UploadModel;

import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

function ModelImage({ fileId, filethumbnailUrl, fileName, userId, isLiked }) {
  const [isImageLiked, setIsImageLiked] = useState(isLiked);

  const likeFile = async (userId, fileId) => {
    // OPTIMIZE: optimize the like functionality
    try {
      setIsImageLiked(true);
      const ref = doc(db, 'userLikes', userId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { likedFiles: [] });
      }
      await updateDoc(ref, {
        likedFiles: arrayUnion(fileId),
      });
    } catch (error) {
      void error;
      setIsImageLiked(false);
    }
  };
  const unlikeFile = async (userId, fileId) => {
    try {
      setIsImageLiked(false);
      const ref = doc(db, 'userLikes', userId);
      await updateDoc(ref, {
        likedFiles: arrayRemove(fileId),
      });
    } catch (error) {
      void error;
      setIsImageLiked(true);
    }
  };
  return (
    <>
      <div className='flex flex-col shadow-md p-2 rounded-lg'>
        <Link to={`/models/${fileId}`} className='flex flex-col'>
          <img
            src={filethumbnailUrl || '/public/assets/thumbnail.jpg'}
            className='w-44 h-44'
          />
          <span className='text-gray-900  hover:text-gray-700 transition-colors duration-200 cursor-pointer'>
            {fileName}
          </span>
        </Link>
        <button
          onClick={() => {
            // IMPROVE: throttle likes and unlike clicks so user can't exploit it
            if (isImageLiked) {
              unlikeFile(userId, fileId);
            } else {
              likeFile(userId, fileId);
            }
          }}
          className='text-gray-900 cursor-pointer mt-2'
        >
          {isImageLiked ? 'Liked' : 'Like'}
        </button>
      </div>
    </>
  );
}

export default ModelImage;

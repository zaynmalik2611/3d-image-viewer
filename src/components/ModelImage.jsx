import { doc, setDoc } from 'firebase/firestore';
import React from 'react';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

function ModelImage({ fileId, filethumbnailUrl, fileName, userId, isLiked }) {
  // TODO: make the likes user centric so they are easily retrievable
  const onLikePost = async (fileId) => {
    // TODO: check for userId definition and fallback to signup if not there
    const likeRef = doc(db, 'files', fileId, 'likes', userId);
    await setDoc(likeRef, { likedAt: Date.now() });
    console.log('liked');
  };
  return (
    <>
      <div className='flex flex-col'>
        <Link to={`/models/${fileId}`} className='flex flex-col'>
          <img
            src={filethumbnailUrl || '/public/assets/thumbnail.jpg'}
            className='w-44 h-44'
          />
          <span className='text-white  hover:text-blue-400 transition-colors duration-200 cursor-pointer'>
            {fileName}
          </span>
        </Link>
        <button
          onClick={() => onLikePost(fileId)}
          className='text-white cursor-pointer mt-2'
        >
          Like
        </button>
      </div>
    </>
  );
}

export default ModelImage;

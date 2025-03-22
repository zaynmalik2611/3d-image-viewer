import React from 'react';
import ModelImage from './ModelImage';

function ImagesGrid({ isLoading, files, userId }) {
  if (isLoading)
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 mt-8  gap-4'>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className='flex justify-center'>
            <div className='w-44 h-44 bg-gray-400 animate-pulse rounded'></div>
          </div>
        ))}
      </div>
    );
  if (files.length) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 mt-8  gap-4'>
        {files.map((file, index) => (
          <div className='flex justify-center' key={index}>
            <ModelImage
              fileId={file.id}
              fileName={file.fileName}
              filethumbnailUrl={file.thumbnailUrl}
              userId={userId}
              //   isLiked={file.isLiked}
            />
          </div>
        ))}
      </div>
    );
  } else {
    return <div className='text-white text-center'>No Images Found</div>;
  }
}

export default ImagesGrid;

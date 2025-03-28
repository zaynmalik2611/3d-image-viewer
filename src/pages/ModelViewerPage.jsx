import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ModelViewer from '../components/ModelViewer';

function ModelViewerPage() {
  const { fileId } = useParams();
  return (
    <div>
      <div className='flex justify-between mt-1 p-1'>
        <Link to='/'>
          <button className='bg-gray-900 cursor-pointer text-white p-2 rounded-sm'>
            Back
          </button>
        </Link>
        <h1 className='text-center text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-transparent bg-clip-text drop-shadow-lg tracking-wide '>
          DepthView
        </h1>
        <div></div>
      </div>
      <div className='flex justify-center'>
        <ModelViewer fileId={fileId} />
      </div>
    </div>
  );
}

export default ModelViewerPage;

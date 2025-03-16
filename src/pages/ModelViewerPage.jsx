import React from 'react';
import { useParams } from 'react-router-dom';
import ModelViewer from '../components/ModelViewer';

function ModelViewerPage() {
  const { fileId } = useParams();

  return (
    <div>
      <h1 className='text-center text-2xl'>Model Viewer Page</h1>
      <div className='flex justify-center'>
        <ModelViewer fileId={fileId} />
      </div>
    </div>
  );
}

export default ModelViewerPage;

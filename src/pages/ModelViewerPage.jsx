import React from 'react';
import { useParams } from 'react-router-dom';
import ModelViewer from '../components/ModelViewer';

function ModelViewerPage() {
  const { modelName } = useParams();

  return (
    <div>
      <h1 className='text-center text-2xl'>Model Viewer Page</h1>
      <h2 className='pl-4'>{modelName}</h2>
      <div className='flex justify-center'>
        <ModelViewer modelName={modelName} />
      </div>
    </div>
  );
}

export default ModelViewerPage;

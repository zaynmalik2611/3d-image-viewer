import React from 'react';
import { useParams } from 'react-router-dom';
import ModelViewer from '../components/ModelViewer';

function ModelViewerPage() {
  const { modelName } = useParams();

  return (
    <div>
      <h1>Model Viewer Page</h1>
      <h2>{modelName}</h2>
      <ModelViewer modelName={modelName} />
    </div>
  );
}

export default ModelViewerPage;

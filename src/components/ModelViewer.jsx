import React, { useEffect, useState } from 'react';
import '@google/model-viewer';
import { storage, ref, getDownloadURL } from '../firebase';
const ModelViewer = ({ modelName }) => {
  const [glbUrl, setGlbUrl] = useState('');

  async function fetchGLBFile() {
    const fileRef = ref(storage, `/${modelName}`); // Adjust the path if needed
    try {
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      console.error('Error fetching GLB file:', error);
      return '';
    }
  }

  useEffect(() => {
    fetchGLBFile().then(setGlbUrl);
  }, []);

  return (
    <div>
      <model-viewer
        src={glbUrl}
        alt='3D Model'
        ar
        auto-rotate
        camera-controls
        style={{ width: '800px', height: '700px' }}
      />
    </div>
  );
};

export default ModelViewer;

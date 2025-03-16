import React, { useEffect, useState } from 'react';
import '@google/model-viewer';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
const ModelViewer = ({ fileId }) => {
  const [glbUrl, setGlbUrl] = useState('');
  console.log('fileId', fileId);
  async function fetchGLBFile() {
    try {
      const docRef = doc(db, 'files', fileId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fileDoc = docSnap.data();
        return fileDoc?.fileURL ?? '';
      } else {
        return '';
      }
    } catch (error) {
      console.error('Error fetching a single file.', error);
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
        style={{ width: '800px', height: '600px' }}
      />
    </div>
  );
};

export default ModelViewer;

import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModelViewerPage from './pages/ModelViewerPage';
import UploadModelPage from './pages/UploadModelPage';

function App() {
  return (
    <>
      {/* TODO: setup git */}
      {/* CHORE: add an env and save sensitive information in the env*/}
      {/* CHORE: understand the firebase security settings and configure the values */}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/models/:modelName' element={<ModelViewerPage />} />
        <Route path='/upload' element={<UploadModelPage />} />
      </Routes>
    </>
  );
}

export default App;

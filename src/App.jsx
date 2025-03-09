import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModelViewerPage from './pages/ModelViewerPage';
import UploadModelPage from './components/UploadModel';
import SignupPage from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <>
      {/* CHORE: add an env and save sensitive information in the env */}
      {/* CHORE: understand the firebase security settings and configure the values */}
      {/* CHORE: add authentication */}
      {/* TODO: improve the UI of the app */}
      {/* CHORE: add 404 fallback page */}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/models/:modelName' element={<ModelViewerPage />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<UserDashboard />} />
        </Route>
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default App;

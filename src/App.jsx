import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModelViewerPage from './pages/ModelViewerPage';
import UploadModelPage from './components/UploadModel';
import SignupPage from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import UserDashboard from './pages/UserDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      {/* CHORE: understand the firebase security settings and configure the values */}
      {/* TODO: improve the UI of the app */}
      {/* TODO: improve the userdashboard page */}
      {/* TODO: make a user feed page */}
      {/* TODO: implement the like functionality in the app */}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/models/:modelName' element={<ModelViewerPage />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<UserDashboard />} />
        </Route>
        <Route path='/auth' element={<SignupPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

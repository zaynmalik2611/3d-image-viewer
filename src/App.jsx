import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModelViewerPage from './pages/ModelViewerPage';
import SignupPage from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import UserDashboard from './pages/UserDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      {/* TODO: implement limits on usage */}
      {/* TODO: remove all consoles before pushing code */}
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<HomePage />} />
        </Route>
        <Route path='/models/:fileId' element={<ModelViewerPage />} />
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

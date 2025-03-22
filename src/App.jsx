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
      {/* CHORE: understand the firebase security settings and configure the values */}
      {/* TODO: implement limits on usage */}
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

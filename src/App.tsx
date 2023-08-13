import { useState, useEffect, useRef } from 'react';
import jwtDecode from "jwt-decode";
import { RouterProvider } from 'react-router';
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route
} from "react-router-dom";
import Root from './pages/Root';
import AuthContainer from './pages/AuthContainer';
import Login from './components/Login';
import Register from './components/Register';
import AuthContext, { AuthContextData } from './contexts/AuthContext';
import { KEY_LOCAL_STORAGE } from './utils/Contantes';
import { LocalStorageTokenType } from './hooks/useAuth';
import TokenDataType from './types/TokenDataType';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={ <Root /> }
    >
      <Route
        path="auth"
        element={ <AuthContainer /> }
      >
        <Route
          path="login"
          element={ <Login /> }
        />
        <Route
          path="register"
          element={ <Register /> }
        />
      </Route>
    </Route>
  )
)

const App = () => {
  const [authContextData, setAuthContextData] = useState<AuthContextData>({});
  const [isReady, setIsReady] = useState<boolean>(false);
  const refVerifyToken = useRef<boolean>(false);

  useEffect(() => {
    if(refVerifyToken.current === false) {
      const localStorageData = localStorage.getItem(KEY_LOCAL_STORAGE);
      if(localStorageData) {
        const localStorageObj = JSON.parse(localStorageData) as LocalStorageTokenType;
        try {
          const tokenData = jwtDecode(localStorageObj.token) as  TokenDataType;
          setAuthContextData({
            tokenData
          })
        }
        catch(e) {}
      }
      setIsReady(true);
    }
  }, [])

  if(isReady) {
    return (
      <AuthContext.Provider value={{
        authContextData,
        setAuthContextData
      }}>
        <RouterProvider router={router} />
        <ToastContainer
          theme='dark'
          position='bottom-right'
          autoClose={3000}
        />
      </AuthContext.Provider>
    );
  }
  else {
    return  <></>
  }

}

export default App

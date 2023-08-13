import { useContext } from 'react';
import jwtDecode from "jwt-decode";
import AuthContext from '../contexts/AuthContext';
import TokenDataType from '../types/TokenDataType';
import { KEY_LOCAL_STORAGE } from '../utils/Contantes';

const useAuth = () => {

  const { authContextData, setAuthContextData } = useContext(AuthContext);

  const saveToken = (token: string) => {
    try {
      const tokenData = jwtDecode(token) as TokenDataType;
      localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify({
        token
      }))
      setAuthContextData({
        tokenData
      });
    }
    catch(e) {
      console.error(e);
    }
  }

  const logout = () => {
    setAuthContextData({});
    localStorage.removeItem(KEY_LOCAL_STORAGE);
  }

  const isAuthenticated = (): boolean => {
    return authContextData.tokenData !== undefined && (authContextData.tokenData.exp > (Date.now() / 1000));
  }

  return {
    authContextData,
    isAuthenticated,
    saveToken,
    logout,
    tokenData: authContextData.tokenData
  }
}

export default useAuth;

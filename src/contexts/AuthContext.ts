import { createContext } from 'react';
import TokenDataType from '../types/TokenDataType';

export type AuthContextData = {
  tokenData?: TokenDataType
  token?: string
}

export type AuthContextType = {
  authContextData: AuthContextData,
  setAuthContextData: (authContextData: AuthContextData) => void
}

const AuthContext = createContext<AuthContextType>({
  authContextData: {
    tokenData: undefined
  },
  setAuthContextData: () => null
});

export default AuthContext;

import React, { createContext, useReducer, useCallback } from 'react';
import { adminAPI } from '@services/api';

export const AuthContext = createContext();

const initialState = {
  admin: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        admin: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { admin } = await adminAPI.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: admin });
      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    adminAPI.logout();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = {
    ...state,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
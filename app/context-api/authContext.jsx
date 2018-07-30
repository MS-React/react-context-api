import React from 'react';

export const auth = {
  authenticating: false,
  isAuthenticated: false,
  error: false,
  errorMessage: null,
  user: null,
  login: () => {}
};

export const AuthContext = React.createContext({
  ...auth
});

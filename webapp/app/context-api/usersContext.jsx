import React from 'react';

export const users = {
  data: [],
  selectedUser: {},
  fetch: {
    loading: false,
    error: null
  },
  getUsers: () => {},
  createUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
  selectUser: () => {}
};

export const UsersContext = React.createContext({
  ...users
});

import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { UsersContext, users,  } from './usersContext';
import { AuthContext, auth } from './authContext';

import {
  DEFAULT_USER_VALID_ID_PATHS,
  DEFAULT_PAGINATION_QUERY
} from '../constants';

import * as userService from '../services/userService';
import * as authService from '../services/authService';
import { handleErrors } from '../services/errorService';

import { getUserId } from '../utils/user';

class AppProvider extends React.Component {
  constructor(props) {
    super(props);

    // users function data bind
    this.getUsers = this.getUsers.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.selectUser = this.selectUser.bind(this);
    // auth function data bind
    this.login = this.login.bind(this);

    // State also contains the updater function so it will
    // be passed down withs the context provider
    this.state = {
      users: {
        ...users,
        getUsers: this.getUsers,
        createUser: this.createUser,
        updateUser: this.updateUser,
        deleteUser: this.deleteUser,
        selectUser: this.selectUser
      },
      auth: {
        ...auth,
        login: this.login
      }
    };
  }

  getUsers (queryParams = DEFAULT_PAGINATION_QUERY) {
    return userService.fetchUsers(queryParams)
      .then(handleErrors)
      .then(({ data }) => {
        this.setState({
          users: {
            ...this.state.users,
            data: data.docs,
            fetch: {
              error: null,
              loading: false
            }
          }
        });

        return data;
      });
  }

  createUser (userData) {
    return userService.createUsers(omit(userData, DEFAULT_USER_VALID_ID_PATHS))
      .then(handleErrors)
      .then(({ data }) => {
        this.setState({
          users: {
            ...this.state.users,
            data: [
              ...this.state.users.data,
              data
            ]
          }
        });

        return users;
      });
  }

  updateUser (updatedUser) {
    return userService.updateUsers(getUserId(updatedUser), omit(updatedUser, DEFAULT_USER_VALID_ID_PATHS))
      .then(handleErrors)
      .then(() => {
        this.setState({
          users: {
            ...this.state.users,
            data: [
              updatedUser,
              ...this.state.users.data.filter(
                user => getUserId(updatedUser) !== getUserId(user)
              )
            ],
            fetch: {
              loading: false,
              error: null
            }
          }
        }, function () {
          return users;
        });
      });
  }

  deleteUser (deletedUser) {
    return userService.deleteUsers(getUserId(deletedUser))
      .then(() => {
        this.setState({
          users: {
            ...this.state.users,
            data: this.state.users.data.filter(
              user => getUserId(deletedUser) !== getUserId(user)
            ),
            fetch: {
              loading: false,
              error: null
            },
            selectedUser: {}
          }
        }, function () {
          return users;
        });
      });
  }

  selectUser (selectedUser) {
    this.setState({
      users: {
        ...this.state.users,
        selectedUser
      }
    });
  }

  login (username, password) {
    return authService.login(username, password)
      .then(response => {
        this.setState({
          auth: {
            ...this.state.auth,
            isAuthenticated: true,
            user: response.user
          }
        });
      },
      error => this.loginFailed(error));
  }

  loginFailed (error) {
    this.setState({
      auth: {
        ...this.state.auth,
        ...this.getAuthInitialState(),
        error: true,
        errorMessage: error.message
      }
    });
  }

  getAuthInitialState () {
    return omit(auth, 'login');
  }

  render() {
    return (
      <AuthContext.Provider value={this.state.auth}>
        <UsersContext.Provider value={this.state.users}>
          {this.props.children}
        </UsersContext.Provider>
      </AuthContext.Provider>
    );
  }
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;

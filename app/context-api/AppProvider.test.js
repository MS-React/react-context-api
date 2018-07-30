import React from 'react';
import { shallow } from 'enzyme';
import AppProvider from './AppProvider';
import { keys } from 'lodash/fp';
import * as userService from '../services/userService';
import * as authService from '../services/authService';
import {getUserId} from '../utils/user';

describe('<AppProvider /> component', () => {
  function setup(props) {
    return shallow(
      <AppProvider
        {...props}
      >
        <div>Hello</div>
      </AppProvider>
    );
  }

  describe('Initial State', () => {
    it('should should set users initial state', () => {
      // Arrange
      const expectedState = [
        'data',
        'selectedUser',
        'fetch',
        'getUsers',
        'createUser',
        'updateUser',
        'deleteUser',
        'selectUser'
      ];

      // Act
      const wrapper =  setup({});

      // Arrange
      expect(keys(wrapper.instance().state.users)).toEqual(expectedState);
    });

    it('should should set auth initial state', () => {
      // Arrange
      const expectedState = [
        'authenticating',
        'isAuthenticated',
        'error',
        'errorMessage',
        'user',
        'login'
      ];

      // Act
      const wrapper =  setup({});

      // Arrange
      expect(keys(wrapper.instance().state.auth)).toEqual(expectedState);
    });
  });

  // this.createUser = this.createUser.bind(this);
  // this.updateUser = this.updateUser.bind(this);
  // this.deleteUser = this.deleteUser.bind(this);
  // this.selectUser = this.selectUser.bind(this);
  describe('users functions', () => {
    const defaultReponseStatusProps = {
      status: 200,
      statusText: 'OK',
      ok: true
    };

    it('should get Users', async () => {
      // Arrange
      const expectedData = ['user'];
      const wrapper =  setup({});
      userService.fetchUsers = jest.fn(() => Promise.resolve({
        ...defaultReponseStatusProps,
        data: {
          docs: expectedData
        }
      }));

      // Act
      const result = await wrapper.instance().getUsers();

      // Assert
      expect(result.docs).toEqual(expectedData);
      expect(wrapper.instance().state.users.data).toEqual(expectedData);
    });

    it('should create a User', async () => {
      // Arrange
      const userData = {
        id: 'Id',
        name: 'John Doe'
      };
      const expectedData = [userData];

      const wrapper =  setup({});
      userService.createUsers = jest.fn(() => Promise.resolve({
        ...defaultReponseStatusProps,
        data: userData
      }));

      // Act
      await wrapper.instance().createUser(userData);

      // Assert
      expect(wrapper.instance().state.users.data).toEqual(expectedData);
    });

    it('should update a User', async () => {
      // Arrange
      const userData = {
        id: 'Id',
        name: 'John Doe'
      };
      const expectedData = [userData];

      const wrapper =  setup({});

      userService.updateUsers = jest.fn(() => Promise.resolve({
        ...defaultReponseStatusProps,
        data: userData
      }));
      wrapper.instance().setState({
        users: {
          ...wrapper.instance().state.users,
          data: [
            {
              id: 'Id',
              name: 'Jhon Doe' // typo in John
            }
          ]
        }
      });

      // Act
      await wrapper.instance().updateUser(userData);

      // Assert
      expect(wrapper.instance().state.users.data).toEqual(expectedData);
    });

    it('should delete a User', async () => {
      // Arrange
      const userData = {
        id: 'Id',
        name: 'John Doe'
      };
      const expectedData = [];

      const wrapper =  setup({});
      userService.deleteUsers = jest.fn(() => Promise.resolve({
        ...defaultReponseStatusProps,
        data: userData
      }));
      wrapper.instance().setState({
        users: {
          ...wrapper.instance().state.users,
          data: [
            {
              id: 'Id',
              name: 'John Doe'
            }
          ]
        }
      });

      // Act
      await wrapper.instance().deleteUser(userData);

      // Assert
      expect(wrapper.instance().state.users.data).toEqual(expectedData);
    });

    it('should select a User', async () => {
      // Arrange
      const expectedUser = {
        id: 'Id',
        name: 'John Doe'
      };

      const wrapper =  setup({});

      // Act
      await wrapper.instance().selectUser(expectedUser);

      // Assert
      expect(wrapper.instance().state.users.selectedUser).toEqual(expectedUser);
    });
  });

  describe('auth functions', () => {
    const defaultReponseStatusProps = {
      status: 200,
      statusText: 'OK',
      ok: true
    };

    it('should login successfully', async () => {
      // Arrange
      const wrapper =  setup({});
      const userName = 'jdoe';
      const password = 'secret';
      authService.login = jest.fn(() => Promise.resolve({
        user: userName
      }));

      // Act
      await wrapper.instance().login(userName, password);

      // Assert
      expect(wrapper.instance().state.auth.isAuthenticated).toBe(true);
      expect(wrapper.instance().state.auth.user).toBe(userName);
    });

    it('should login with error', async () => {
      // Arrange
      const wrapper =  setup({});
      const userName = 'jdoe';
      const password = 'secret';
      const message = 'Ah ah ah!! You didn\'t said the magic words';
      authService.login = jest.fn(() => Promise.reject({
        message
      }));

      // Act
      await wrapper.instance().login(userName, password);

      // Assert
      expect(wrapper.instance().state.auth.isAuthenticated).toBe(false);
      expect(wrapper.instance().state.auth.user).toBe(null);
      expect(wrapper.instance().state.auth.error).toBe(true);
      expect(wrapper.instance().state.auth.errorMessage).toBe(message);
    });
  });
});

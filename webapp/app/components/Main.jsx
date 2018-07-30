import React from 'react';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import NotFoundPage from './pages/not_found/NotFoundPage';
import { Switch, Route } from 'react-router-dom';
import { UsersContext } from '../context-api/usersContext';
import { AuthContext } from '../context-api/authContext';

export default class Main extends React.Component {
  // Context from users, keep data from select users, all users and methods
  // to be called by the child components
  renderHomePage() {
    return (
      <UsersContext.Consumer>
        { usersContext => <HomePage usersContext={usersContext} /> }
      </UsersContext.Consumer>
    );
  }

  // Context from auth, keep data from authentification, all users and methods
  // to be called by the child components
  renderLoginPage() {
    return (
      <AuthContext.Consumer>
        { authContext => <LoginPage authContext={authContext} /> }
      </AuthContext.Consumer>
    );
  }

  render() {
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/"
            render={this.renderHomePage} />
          <Route
            exact
            path="/login"
            render={this.renderLoginPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

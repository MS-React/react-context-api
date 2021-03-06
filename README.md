# Directly Training Frontend

Directly training app, is an application with **webpack**, **react** and **redux** to make additions, deletions, and modifications from users.

## Prerequisites

## Ubuntu

**install npm version, node >= 8**
  * `sudo apt-get update`
  * `sudo apt-get install nodejs`
  * `sudo apt-get install npm`

Also, you can use [nvm node version management tool](https://github.com/creationix/nvm)

**install yarn latest**
  * `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
  * `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
  * `sudo apt-get update && sudo apt-get install yarn`

## Windows

  * [Install npm](http://blog.teamtreehouse.com/install-node-js-npm-windows)
  * [Install yarn](https://yarnpkg.com/lang/en/docs/install/#windows-stable)

## Start application
  - Install packages `npm install` or `yarn install`
  - Run app: `npm start` or `yarn start`
  - By default, the application starts on http://localhost:8080
  - The backend is integrated with the API [MS BE with heroku](https://ms-labs-be.herokuapp.com) you can check the repo here: [MS BE Repository](https://github.com/MS-React/backend)
  - You can point to the local backend with the file **app/constants.js**

  >For now don't commit this **.env.development** or **constants.js** file changes

### Commands

**install packages**
```ssh
npm install
```
**start app**
```ssh
npm start
```
### Dev tools

**run tests**
```ssh
npm test
```

**run test with watch**
```ssh
test:dev
```

**linter rules**
```ssh
npm run lint
```
**sass rules**
```ssh
npm run sass-lint
```

**build from production**
```ssh
npm run build
```

# React Context API

Documentation about [Context API](https://daveceddia.com/context-api-vs-redux/)

How does it work?
- Configuration
- Context
- Provider
- Consumer

### Configuration
Works with newest versions from React `16.3.0`

### Context: authContext
Notice how the context does not have its own state. It is merely a conduit for your data. You have to pass a value to the Provider, and that exact value gets passed down to any Consumers that know how to look for it (Consumers that are bound to the same context as the Provider).
```javascript
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
```
### Provider: AppProvider
 Very similar to React-Redux’s Provider. It accepts a value prop which can be whatever you want (it could even be a Redux store… but that’d be silly). It’ll most likely be an object containing your data and any actions you want to be able to perform on the data.
```javascript
class AppProvider extends React.Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.state = {
      auth: {
        ...auth,
        login: this.login
      }
    };
  }

  login (username, password) {
    this.setState({
      auth: {
        ...this.state.auth,
        isAuthenticated: true
      }
    });
  }

  render() {
    return (
      <AuthContext.Provider value={this.state.auth}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
```
### Consumer
Works a little bit like React-Redux’s connect function, tapping into the data and making it available to the component that uses it.
```javascript
export default class Main extends React.Component {
  renderLoginPage() {
    return (
      <AuthContext.Consumer>
        { authContext => <HomePage authContext={authContext} /> }
      </AuthContext.Consumer>
    );
  }
}
```

>For now don't commit this **.env.development** or **constants.js** file changes

If you need to work with the current **ms-labs-be** app request access to

[Mariano Ravinale](mailto:mravinale@makingsense.com)

[Emanuel Pereyra](mailto:epereyra@makingsense.com)

[Ivan Scoles](mailto:iscoles@makingsense.com)

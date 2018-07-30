# React Context API

Documentation about [Context API](https://daveceddia.com/context-api-vs-redux/)

How does it work?
- Configuration
- Context
- Provider
- Consumer

# Configuration
Works with newest versions from React `16.3.0`

# Context: authContext
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
# Provider: AppProvider
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
# Consumer
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

# Back end deployment to Heroku
Create a [Heroku](https://www.heroku.com) account.

Install [Heroku-Cli](https://devcenter.heroku.com/articles/heroku-cli#download-and-install), follow the instructions to install and create a heroku app for your development there
EG

`$ heroku create ms-lab-tests`


**DON'T PUSH TO HEROKU YET**

Install your own Databse plugin:

`$ heroku addons:create jawsdb:kitefin`

Get DB credentials:

`$ heroku config:get JAWSDB_URL`

It will return somethin like:

`mysql://gr6fbtjxjq59el9d:fefkz3p13ufsa759@g8mh6ge01lu2z3n1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/hm4stiy5qmvd73y6`

Where

- Username: gr6fbtjxjq59el9d
- Password: fefkz3p13ufsa759
- Host: g8mh6ge01lu2z3n1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com
- Port: 3306
- Database: hm4stiy5qmvd73y6

Use this credentials into your .env.development file.

Get the app url

`$ heroku info -s | grep web_url | cut -d= -f2`

Change the DEFAULT_BASE_URL constant in webapp/constants.js file to target your app url

`export const DEFAULT_BASE_URL = 'https://ms-lab-tests.herokuapp.com/';`

Set `NODE_ENV` to development:

`heroku config:set NODE_ENV=development`

Work as usual, commit to git as usual, when you are done with your changes enter the following command from the root of the project:

`$ git subtree push --prefix server heroku master`

With this you will push your branch to Heroku but only the server folder.

>For now don't commit this **.env.development** or **constants.js** file changes

If you need to work with the current **ms-labs-be** app request access to

[Mariano Ravinale](mailto:mravinale@makingsense.com)

[Emanuel Pereyra](mailto:epereyra@makingsense.com)

[Ivan Scoles](mailto:iscoles@makingsense.com)

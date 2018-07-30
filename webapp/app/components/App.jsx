import React from 'react';
// AppProvider context from app
import AppProvider from '../context-api/AppProvider';
// Added browser router to manage urls
import { BrowserRouter } from 'react-router-dom';
import { browserHistory } from 'react-router';
import Main from './Main';

class App extends React.Component {
  render() {
    return (
      <AppProvider>
        <BrowserRouter history={browserHistory}>
          <Main />
        </BrowserRouter>
      </AppProvider>
    );
  }
}

export default App;

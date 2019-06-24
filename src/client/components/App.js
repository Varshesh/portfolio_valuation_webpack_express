import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Portfolios from './portfolios';
import Transactions from './transactions';

class App extends Component {

  render() {
    const AppRoutes = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Portfolios} />
          <Route path='/transactions' component={Transactions} />
        </Switch>
      </div>
    )

    return (
      <div className="app-container">
        <header className="app-header">
          <h3 className="title">Portfolio Manager</h3>
        </header>

        <div className="app-content-container">
          <Switch>
            <AppRoutes />
          </Switch>
        </div>
      </div>

    );
  }
}

export default App;

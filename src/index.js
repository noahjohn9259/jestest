/* eslint-disable import/default */
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from './routes';
import configureStore from './store/configureStore';
// import { loadMessages } from './actions/messageActions';
// import { userStatus } from './actions/userActions';

require('./favicon.ico'); // Tell webpack to load favicon.ico

// import '../node_modules/bootswatch/flatly/bootstrap.min.css';
// import './stylesheets/main.scss';
// import './stylesheets/responsive.scss';

const store = configureStore();
// store.dispatch(userStatus());
// store.dispatch(loadMessages());
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes}/>
  </Provider>,
  document.getElementById('app')
);

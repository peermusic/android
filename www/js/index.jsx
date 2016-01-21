/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        const React = require('react')
        const ReactDOM = require('react-dom')
        const { createStore, applyMiddleware, combineReducers } = require('redux')
        const { Provider } = require('react-redux')
        const { Router, Route, IndexRedirect } = require('react-router')
        const createHistory = require('history/lib/createHashHistory')
        const { syncReduxAndRouter } = require('redux-simple-router')
        const thunk = require('redux-thunk')
        // const logger = require('redux-logger')()
        const reduxStorage = require('redux-storage')
        const storageEngine = require('redux-storage/engines/localStorage').default('peermusic-storage')
        const { PLAYER_SYNCHRONIZE, INSTANCES_CONNECT } = require('./actions')

        // Create our reducer composition via the reducers registered in reducers/index.js
        const reducer = reduxStorage.reducer(combineReducers(require('./reducers')))

        // Create our storage middleware with blacklisted actions that don't trigger storage events
        // TODO write a debounce decorator with a max wait time
        const storage = reduxStorage.createMiddleware(storageEngine, ['@@router/INIT_PATH'])

        // Everything is prepared, combine the middleware and the reducer into a store
        const store = applyMiddleware(storage, thunk)(createStore)(reducer)

        // Load the state we saved before when the application loads
        // and sync that state into the player engine
        const load = reduxStorage.createLoader(storageEngine)
        load(store).then(() => {
          PLAYER_SYNCHRONIZE()(store.dispatch, store.getState)
          INSTANCES_CONNECT()(store.dispatch, store.getState)
        })

        // Setup redux-router with history and sync the state to the url
        const history = createHistory({queryKey: false})
        syncReduxAndRouter(history, store)

        // Require our application components
        const App = require('./app/components/App.jsx')
        const Songs = require('./app/components/Songs/index.jsx')
        const Albums = require('./app/components/Albums/index.jsx')
        const Artists = require('./app/components/Artists/index.jsx')
        const Favorites = require('./app/components/Favorites/index.jsx')
        const PlayingNext = require('./app/components/PlayingNext/index.jsx')
        const History = require('./app/components/History/index.jsx')
        const ManageFriends = require('./app/components/ManageFriends/index.jsx')
        const ManageSongs = require('./app/components/ManageSongs/index.jsx')
        const ManageServers = require('./app/components/ManageServers/index.jsx')
        const ManageDownloads = require('./app/components/ManageDownloads/index.jsx')
        const Search = require('./app/components/Search/index.jsx')
        const CurrentlyPlaying = require('./app/components/CurrentlyPlaying/index.jsx')

        // Render our application
        ReactDOM.render(
          <Provider store={store}>
              <Router history={history}>
                <Route path='/' component={App}>
                  <IndexRedirect to='songs'/>
                  <Route path='currently-playing' component={CurrentlyPlaying}/>
                  <Route path='songs' component={Songs}/>
                  <Route path='albums' component={Albums}/>
                  <Route path='artists' component={Artists}/>
                  <Route path='favorites' component={Favorites}/>
                  <Route path='playing-next' component={PlayingNext}/>
                  <Route path='history' component={History}/>
                  <Route path='manage-friends' component={ManageFriends}/>
                  <Route path='manage-songs' component={ManageSongs}/>
                  <Route path='manage-servers' component={ManageServers}/>
                  <Route path='manage-downloads' component={ManageDownloads}/>
                  <Route path='search' component={Search}/>
                </Route>
              </Router>
            </Provider>,
          document.getElementById('render')
        )
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(preloadedState) {
  const middlewares = [thunk];
  const store = createStore(rootReducer, preloadedState, composeEnhancers(applyMiddleware(...middlewares)));
  return store;
}

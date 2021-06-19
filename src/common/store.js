import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

  return store;
}

export default configureStore();

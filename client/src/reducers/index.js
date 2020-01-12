import { combineReducers } from 'redux';
import sendFile from './sendFile';
import recvFile from './recvFile';

const rootReducer = combineReducers({
  sendFile,
  recvFile,
});

export default rootReducer;

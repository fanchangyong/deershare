import produce from 'immer';
import * as types from '../common/actionTypes';

const initialState = {
  downloadCode: '',
};

const fileReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_UPLOAD_INFO: {
      draft.downloadCode = action.payload.downloadCode;
      break;
    }
    case types.UPDATE_DOWNLOAD_INFO: {
      console.log('## update download info: ', action.payload)
      break;
    }
  }
  return draft;
});

export default fileReducer;

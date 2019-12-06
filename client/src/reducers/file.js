import produce from 'immer';
import * as types from '../common/actionTypes';

const initialState = {
  downloadCode: '',
  uploadInfo: {
    message: '',
    files: [],
  },
};

const fileReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_UPLOAD_INFO: {
      draft.downloadCode = action.payload.downloadCode;
      break;
    }
    case types.UPDATE_DOWNLOAD_INFO: {
      draft.uploadInfo.message = action.payload.message;
      draft.uploadInfo.files = action.payload.files;
      break;
    }
  }
  return draft;
});

export default fileReducer;

import produce from 'immer';
import * as types from '../common/actionTypes';

const initialState = {
  recvCode: '',
};

const fileReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_UPLOAD_INFO: {
      draft.recvCode = action.payload.recvCode;
      break;
    }
  }
  return draft;
});

export default fileReducer;

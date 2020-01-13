import produce from 'immer';
import * as types from '../common/actionTypes';

const initialState = {
  targetId: '',
  files: [],
};

const fileReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_RECV_FILE_INFO: {
      draft.targetId = action.payload.clientId;
      draft.files = action.payload.files;
      break;
    }
  }
  return draft;
});

export default fileReducer;

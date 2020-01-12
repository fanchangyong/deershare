import produce from 'immer';
import * as types from '../common/actionTypes';

const initialState = {
  targetId: '',
  fileList: [],
};

const fileReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_RECV_INFO: {
      draft.targetId = action.payload.clientId;
      draft.fileList = action.payload.fileList;
      break;
    }
  }
  return draft;
});

export default fileReducer;

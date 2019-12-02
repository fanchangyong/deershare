import produce from 'immer';
import * as types from '../common/actionTypes';

const initialState = {
  msg: '',
};

const userReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_HELLO_MSG: {
      draft.msg = action.payload;
    }
  }
  return draft;
});

export default userReducer;

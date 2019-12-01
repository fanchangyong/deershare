import produce from 'immer';
import * as types from '../common/actionTypes';

const initialState = {
  msg: '',
};

const userReducer = produce((draft = initialState, action) => {
  console.log('### user reducer');
  switch (action.type) {
    case types.UPDATE_HELLO_MSG: {
      draft.msg = action.payload;
    }
  }
  return draft;
});

// function userReducer (state = initialState, action) {
//   console.log('### user reducer')
//   return produce((draft, action) => {
//     console.log('### user reducer')
//     switch (action.type) {
//       case types.UPDATE_HELLO_MSG: {
//         draft.msg = action.payload;
//       }
//     }
//   });
// }

export default userReducer;

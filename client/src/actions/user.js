import axios from 'axios';
import * as types from '../common/actionTypes';

export function sendHello (msg, callback = () => {}) {
  return (dispatch) => {
    axios.post('/api/hello', {
      msg,
    })
    .then((res) => {
      console.log('## res is: ', res.data)
      dispatch({
        type: types.UPDATE_HELLO_MSG,
        payload: res.data,
      });
    });
  };
}

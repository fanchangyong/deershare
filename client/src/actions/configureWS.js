/* eslint-disable no-unused-vars */
import ws from '../ws';
import * as types from '../common/actionTypes';
import Toast from '../components/common/Toast';

export default function configureWS(dispatch) {
  function s2cPrepareSend(payload) {
    dispatch({ type: types.UPDATE_SEND_FILE_INFO, payload });
  }

  function s2cPrepareRecv(payload) {
    dispatch({ type: types.UPDATE_RECV_FILE_INFO, payload });
  }

  function s2cError(payload) {
    Toast.error(payload.message);
  }

  // 移动到HomePage.js中处理
  // ws.registerMessageHandler('s2c_prepare_send', s2cPrepareSend);
  // ws.registerMessageHandler('s2c_prepare_recv', s2cPrepareRecv);
  ws.registerMessageHandler('s2c_error', s2cError);
}

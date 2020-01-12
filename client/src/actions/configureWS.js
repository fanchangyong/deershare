import ws from '../ws';

import * as types from '../common/actionTypes';

export default function configureWS(dispatch) {
  function s2cPrepareSend(payload) {
    dispatch({ type: types.UPDATE_SEND_FILE_INFO, payload });
  }

  function s2cPrepareRecv(payload) {
    dispatch({ type: types.UPDATE_RECV_FILE_INFO, payload });
  }

  ws.registerMessageHandler('s2c_prepare_send', s2cPrepareSend);
  ws.registerMessageHandler('s2c_prepare_recv', s2cPrepareRecv);
}

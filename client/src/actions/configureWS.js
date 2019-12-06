import {
  getWebSocket,
} from '../WebSocket';

import * as types from '../common/actionTypes';

export default function configureWS(dispatch) {
  const ws = getWebSocket();
  ws.on('message', (msg) => {
    const {
      type,
      payload,
    } = msg;
    switch (type) {
      case 'S2C_PREPARE_UPLOAD': {
        dispatch({ type: types.UPDATE_UPLOAD_INFO, payload });
        break;
      }
      // case 'S2C_PREPARE_DOWNLOAD': {
      //   dispatch({ type: types.UPDATE_DOWNLOAD_INFO, payload });
      //   break;
      // }
      default: {
        console.log('unhandled ws msg: ', msg);
      }
    }
  });
}

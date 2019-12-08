import ws from '../ws';

import * as types from '../common/actionTypes';

export default function configureWS(dispatch) {
  function s2cPrepareUpload(payload) {
    console.log('## s2c prepare upload: ', payload)
    dispatch({ type: types.UPDATE_UPLOAD_INFO, payload });
  }

  ws.registerMessageHandler('s2c_prepare_upload', s2cPrepareUpload);
}

import ws from '../ws';

export function prepareSend(files) {
  ws.sendJSON({
    type: 'c2s_prepare_send',
    payload: {
      files,
    },
  });
}

export function deleteRecvCode(recvCode) {
  ws.sendJSON({
    type: 'c2s_delete_recv_code',
    payload: {
      recvCode,
    },
  });
}

export function prepareRecv(recvCode) {
  ws.sendJSON({
    type: 'c2s_prepare_recv',
    payload: {
      recvCode,
    },
  });
}

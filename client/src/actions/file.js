import ws from '../ws';

export function prepareSend(files) {
  return () => {
    ws.sendJSON({
      type: 'c2s_prepare_send',
      payload: {
        files,
      },
    });
  };
}

export function prepareRecv(recvCode) {
  return () => {
    ws.sendJSON({
      type: 'c2s_prepare_recv',
      payload: {
        recvCode,
      },
    });
  };
}

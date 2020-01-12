import ws from '../ws';

export function prepareUpload(files) {
  return () => {
    ws.sendJSON({
      type: 'c2s_prepare_upload',
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

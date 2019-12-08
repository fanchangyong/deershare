import ws from '../ws';

export function prepareUpload(message, files) {
  return () => {
    ws.sendJSON({
      type: 'c2s_prepare_upload',
      payload: {
        message,
        files,
      },
    });
  };
}

export function prepareDownload(downloadCode) {
  return () => {
    ws.sendJSON({
      type: 'c2s_prepare_download',
      payload: {
        downloadCode,
      },
    });
  };
}

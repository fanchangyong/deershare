import {
  sendWSJson,
} from '../WebSocket';

export function prepareUpload(message, files) {
  return () => {
    sendWSJson({
      type: 'C2S_PREPARE_UPLOAD',
      payload: {
        message,
        files,
      },
    });
  };
}

export function prepareDownload(downloadCode) {
  return () => {
    sendWSJson({
      type: 'C2S_PREPARE_DOWNLOAD',
      payload: {
        downloadCode,
      },
    });
  };
}

import axios from 'axios';

export function sendHello (msg, callback = () => {}) {
  return (dispatch) => {
    axios.post('/api/hello', {
      msg,
    })
    .then((res) => {
      console.log('## res is: ', res.data)
    });
  };
}

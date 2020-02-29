import React from 'react';
import {
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import ws from '../ws';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import SendFilePanel from '../components/SendFilePanel';
import RecvFilePanel from '../components/RecvFilePanel';
import Icon from '../components/common/Icon';
import SloganCard from '../components/SloganCard';

import styles from './HomePage.cm.styl';

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      send: {
        curStep: 1, // 当前在第几步
        files: [], // 已选择的文件
        peerState: '', // WebRTC连接状态
      },
      recv: {
        recvCode: '', // 用户输入的收件码
        peerState: '', // WebRTC连接状态
        started: false, // 是否点击了开始下载
        files: [], // 接收到的文件
        targetId: '', // 对方的peerId
      },
    };

    this.setSendState = this.setSendState.bind(this);
    this.setRecvState = this.setRecvState.bind(this);
    this.onS2cPrepareSend = this.onS2cPrepareSend.bind(this);
    this.onS2cPrepareRecv = this.onS2cPrepareRecv.bind(this);
  }

  onS2cPrepareSend(payload) {
    this.setSendState({
      recvCode: payload.recvCode,
    });
  }

  onS2cPrepareRecv(payload) {
    this.setRecvState({
      targetId: payload.clientId,
      files: payload.files,
    });
  }

  componentDidMount() {
    ws.registerMessageHandler('s2c_prepare_send', this.onS2cPrepareSend);
    ws.registerMessageHandler('s2c_prepare_recv', this.onS2cPrepareRecv);
  }

  setSendState(newState) {
    this.setState(prevState => {
      const nextState = {
        ...prevState,
        send: {
          ...prevState.send,
          ...newState,
        },
      };
      return nextState;
    });
  }

  setRecvState(newState) {
    this.setState(prevState => {
      const nextState = {
        ...prevState,
        recv: {
          ...prevState.recv,
          ...newState,
        },
      };
      return nextState;
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <NavBar />
        <Route exact path="/">
          <Redirect to="/send" />
        </Route>
        <div className={styles.content}>
          <Switch>
            <Route path="/send">
              <SendFilePanel {...this.state.send} setState={this.setSendState} />
            </Route>
            <Route path="/recv/:recvCode?">
              <RecvFilePanel {...this.state.recv} setState={this.setRecvState} />
            </Route>
          </Switch>
          <div className={styles.cardsArea}>
            <div className={styles.cardRow}>
              <SloganCard
                title="简单"
                icon={<Icon name="simple" className={styles.iconSimple}/>}
                desc="无需登录只需要选择好想要发送的文件，然后将生成的下载链接发送给对方即可开始传送"
              />
              <SloganCard
                title="安全"
                icon={<Icon name="secure" className={styles.iconSecure}/>}
                desc="小鹿快传使用P2P技术，文件数据不走服务器，直接发送给对方，且数据自带加密，免去隐私被泄漏的风险。"
              />
            </div>
            <div className={styles.cardRow}>
              <SloganCard
                title="高效"
                icon={<Icon name="speed" className={styles.iconSpeed}/>}
                desc="由于使用P2P技术，文件传输速度不会受到服务器性能的影响，完全取决于你和对方的网速。"
              />
              <SloganCard
                title="专业"
                icon={<Icon name="check-fill" className={styles.iconCheck}/>}
                desc="不限制文件类型，任何文件都可随心传输。所有文件都是原文件传输，传视频图片不损失画质。"
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

HomePage.defaultProps = {};

HomePage.propTypes = {
};

export default HomePage;

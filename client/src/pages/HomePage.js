import React from 'react';
import {
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import NavBar from '../components/NavBar';
import SendFilePanel from '../components/SendFilePanel';
import RecvFilePanel from '../components/RecvFilePanel';
import ContactPanel from '../components/ContactPanel';
import Icon from '../components/common/Icon';
import SloganCard from '../components/SloganCard';

import styles from './HomePage.cm.styl';

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
    };
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
              <SendFilePanel />
            </Route>
            <Route path="/recv/:recvCode?">
              <RecvFilePanel />
            </Route>
            <Route path="/contact">
              <ContactPanel />
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
                desc="由于使用P2P技术，文件传输速度不会收到服务器性能的影响，完全取决于你和对方的网速。"
              />
              <SloganCard
                title="专业"
                icon={<Icon name="check-fill" className={styles.iconCheck}/>}
                desc="不限制文件类型，任何文件都可随心传输。所有文件都是原文件传输，传视频图片不损失画质。"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HomePage.defaultProps = {};

HomePage.propTypes = {
};

export default HomePage;

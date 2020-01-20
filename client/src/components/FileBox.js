import React, { Component } from 'react';
import PropTypes from 'prop-types';
import prettyBytes from 'pretty-bytes';
import Icon from './common/Icon';
import styles from './FileBox.cm.styl';

class FileBox extends Component {
  render() {
    const {
      files,
      removable,
      curFileId,
    } = this.props;

    return (
      <div className={styles.container}>
        {files.map(f => {
          const {
            uid,
            name,
            size,
            downloadUrl,
            pct,
          } = f;
          let downloadInfo = null;
          if (downloadUrl) {
            downloadInfo = <a href={downloadUrl} download={name} className={styles.download}>下载</a>;
          } else if (pct >= 100) {
            downloadInfo = <span className={styles.completed}>完成</span>;
          } else if (uid === curFileId) {
            downloadInfo = <span>{pct}%</span>;
          } else {
            downloadInfo = <span className={styles.waiting}>等待</span>;
          }

          return (
            <div key={f.uid} className={styles.fileRow}>
              <div className={styles.left}>
                <Icon name="file" className={styles.fileIcon} />
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>
                    {name}
                  </div>
                  <div className={styles.fileSize}>
                    {prettyBytes(size)}
                  </div>
                </div>
              </div>
              <div className={styles.right}>
                {!removable && downloadInfo}
                {removable && <Icon name="close" onClick={this.props.onRemoveFile(f.uid)} className={styles.closeIcon} />}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

FileBox.propTypes = {
  files: PropTypes.array,
  removable: PropTypes.bool,
  curFileId: PropTypes.string,
  onRemoveFile: PropTypes.func,
};

export default FileBox;

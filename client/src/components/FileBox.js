import React, { Component } from 'react';
import PropTypes from 'prop-types';
import prettyBytes from 'pretty-bytes';
import Icon from './common/Icon';
import styles from './FileBox.cm.styl';

class FileBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      files,
      removable,
    } = this.props;

    return (
      <div className={styles.container}>
        {files.map(f => {
          return (
            <div key={f.uid} className={styles.fileRow}>
              <Icon name="file" className={styles.fileIcon} />
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>
                  {f.name}
                </div>
                <div className={styles.fileSize}>
                  {prettyBytes(f.size)}
                </div>
              </div>
              {removable && <Icon name="close" onClick={this.props.onRemoveFile(f.uid)} className={styles.closeIcon} />}
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
  onRemoveFile: PropTypes.func,
};

export default FileBox;

import { Model } from 'objection';

class FileCode extends Model {
  static get tableName() {
    return 'file_codes';
  }
}

export default FileCode;

import moment from 'moment';

import {
  getRandomString,
  formatDatetimeForMySQL,
} from '../common/util';
import FileCode from '../models/FileCode';

export async function getCode(req, res, next) {
  const code = getRandomString(8);
  const expiredAt = formatDatetimeForMySQL(moment().add(1, 'days'));
  await FileCode.query().insert({
    code,
    expiredAt,
  });
  res.json({
    code,
  });
}

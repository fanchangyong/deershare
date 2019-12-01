import { Model } from 'objection';

class User extends Model {
  static get tableName () {
    return 'user';
  }
}

export default User;

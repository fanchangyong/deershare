import { Model } from 'objection';

class Feedback extends Model {
  static get tableName() {
    return 'feedbacks';
  }
}

export default Feedback;

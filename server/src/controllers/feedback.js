import Feedback from '../models/feedback';

export async function addFeedback(req, res, next) {
  const {
    contact,
    content,
  } = req.body;

  await Feedback.query().insert({
    contact,
    content,
  });
  res.sendStatus(200);
}

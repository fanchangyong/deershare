import User from '../models/User';

export async function hello (req, res, next) {
  const user = await User.query().first();
  if (user) {
    res.send('There is a user, account: ' + user.account);
  } else {
    const newUser = await User.query().insert({
      account: 'account1',
      password: 'pass1',
    });
    res.send('Inserted new user: ' + newUser.account);
  }
}

let User = require('./models/User');

async function loadUser(req, res, next) {
  console.log("--------")
  console.log("this is the userId")
  console.log(req.session.userId)
  let userId = req.session.userId;

  if (userId) {
    req.user = await User.query().findById(userId);
  }

  next();
}

module.exports = loadUser;

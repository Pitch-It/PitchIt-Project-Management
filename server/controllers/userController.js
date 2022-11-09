const db = require('../models/projectModels');

const userController = {};



userController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;
  const array = [username, password]
  const queryStr = `SELECT users.id, users.username FROM users WHERE users.username=$1 AND users.password=$2`;
  db.query(queryStr, array)
    .then((data) => {
      console.log(data.rows[0]);
      return data.rows[0];
    })
    .then((user) => {
      // If our query returns null, just send back false to our front end
      if (!user) return res.status(400).json(false);
      return res
        .status(200)
        .json({ user_id: user.id, username: user.username });
    })
    .catch((err) => {
      return next({
        log: 'Error in userController.verifyUser',
        status: 400,
        message: { err: err },
      });
    });
};


// ! Think about what if user already exists
userController.createUser = (req, res, next) => {
  const { username, password } = req.body;
  const array = [username, password]
  const queryStr = `INSERT INTO users(username,password) VALUES ($1, $2)`;
  db.query(queryStr, array)
    .then(() => {
      return res.status(200).json(true);
    })
    .catch((err) => {
      return next({
        log: 'Error in userController.verifyUser',
        status: 400,
        message: { err: err },
      });
    });
};


userController.deleteUser = (req, res, next) => {
  const { user_id } = req.body;
  const array = [user_id]
  const queryStr = `DELETE FROM users WHERE users.id = $1`;
  db.query(queryStr, array)
    .then(() => {
      return res.status(200).json(true);
    })
    .catch((err) => {
      return next({
        log: 'Error in userController.deleteUser',
        status: 400,
        message: { err: err },
      });
    });
};


module.exports = userController;

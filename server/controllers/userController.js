const db = require('../models/projectModels');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const saltFactor = 10;
const userController = {};


userController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;
  console.log('userfirst', username);
  console.log('passfirst', password);
  const queryStr = 'SELECT * FROM users WHERE users.username=$1';
  db.query(queryStr,[username])
    .then((data) => {
      console.log(data.rows);
      return data.rows;
    })
    .then((user) => {
      console.log(user);
      // If our query returns null, just send back false to our front end
      if (!user) return res.status(400).json(false);
      // const id = user.id;
      // console.log(id)
      console.log('req pass', password);
      console.log('userpass', user[0].password);
      bcrypt.compare(password, user[0].password, (error, response) => {
        if(response) {
          const id = user[0].id;
          console.log(id);
          const token = jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:3000});
          console.log(token);
          console.log(user);
          return res
            .status(200)
            .json({auth:true, token: token, result: user, id});
        }
      });
      // const token = jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:3000})
      // console.log(token)
      // console.log(user)
      // return res
      //   .status(200)
      //   .json({auth:true, token: token, result: user});

    })
    .catch((err) => {
      console.log('uh oh we got here');
      return next({
        log: 'incorrect username/password combination',
        status: 400,
        message: { err: err },
      });
    });
};


userController.verifyJWT = (req,res,next) => {
  const token = req.headers['x-access-token'];
  if(!token) {
    res.send('we need a token please');
  }
  else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) {res.json({auth:false, message: 'authentication failed'});}
      else {req.userId = decoded.id;}
      return next();
    });
  }
};

// ! Think about what if user already exists
userController.createUser = (req, res, next) => {
  const { username, password } = req.body;
  console.log('usertest', username);
  console.log('passtest', password);
  bcrypt.hash(password, saltFactor, (err, hash) => {
    const queryStr = 'INSERT INTO users(username,password) VALUES ($1, $2)';
    db.query(queryStr,[username,hash])
      .then(() => {
        return res.status(200).json(true);
      })
      .catch((err) => {
        return next({
          log: 'Error in userController.createUser',
          status: 400,
          message: { err: err },
        });
      });
  });
  // const queryStr = `INSERT INTO users(username,password) VALUES ($1, $2)`;
  // db.query(queryStr,[username,password])
  //   .then(() => {
  //     return res.status(200).json(true);
  //   })
  //   .catch((err) => {
  //     return next({
  //       log: 'Error in userController.verifyUser',
  //       status: 400,
  //       message: { err: err },
  //     });
  //   });
};


userController.deleteUser = (req, res, next) => {
  const { user_id } = req.body;
  const array = [user_id];
  const queryStr = 'DELETE FROM users WHERE users.id = $1';
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

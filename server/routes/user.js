const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// All requests here are coming in from /user/...
router.post('/login', userController.verifyUser);

router.post('/signup', userController.createUser);

router.get('/auth', userController.verifyJWT, (req,res) => {
    res.send("You are authorized. Thank you!")
})

router.delete('/', userController.deleteUser);

module.exports = router;

var express = require('express');
var router = express.Router();
var handle = require('../handlers')

router.post('/register', handle.RegisterUser)
router.post('/login', handle.LoginUser)


router.get('/profile/:userId', handle.UserProfile)

module.exports = router
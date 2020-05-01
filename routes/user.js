var express = require('express');
var router = express.Router();
var handle = require('../handlers')

router.post('/register', handle.RegisterUser)
router.post('/login', handle.LoginUser)
router.post('/search/username', handle.getUserByUsername)
router.post('/send/request', handle.sendFriendRequest)

router.get('/profile/:userId', handle.UserProfile)
router.get('/friends/:userId', handle.FriendsList)

module.exports = router
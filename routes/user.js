var express = require('express');
var router = express.Router();
var handle = require('../handlers')

router.post('/register', handle.RegisterUser)
router.post('/login', handle.LoginUser)
router.post('/search/username', handle.searchUsername)
router.post('/send/request', handle.sendFriendRequest)
router.post('/request/acceptRequest',handle.acceptRequest)
router.post('/request/declineRequest',handle.declineRequest)
router.post('/FriendsList',handle.getFriendsList)

router.get('/profile/:userId', handle.UserProfile)
router.get('/request/list/:to', handle.getRequestList)

module.exports = router
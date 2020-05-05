var express = require('express');
var router = express.Router();
var handle = require('../handlers')

router.post('/create', handle.createGame)
router.post('/join', handle.joinGame)
router.post('/close', handle.closeGame)

module.exports = router
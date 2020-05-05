const db = require('../models')

exports.createGame = async (req, res, next) => {
    try {

        var {creator} = req.body
        
        var games = await db.Game.find({}, {}, {sort: {tableNumber: -1}}).limit(1)
        var tableNumber
        if (games.length !== 0) {
            tableNumber = games[0].tableNumber + 1
        } else {
            tableNumber = 1
        }

        var newGame = new db.Game()

        newGame.tableNumber = tableNumber
        newGame.password = Math.floor((Math.random() * 1000000) + 1)
        newGame.players.p1 = creator
        newGame.joined.p1 = true
        newGame.joined.p2 = false
        newGame.gameIsAlive = true

        var newGameId = newGame._id

        var userUpdate = await db.User.findByIdAndUpdate(creator, {
            $push: {
                games: newGameId
            }
        })

        newGame.save()

        res.json(newGame)

    } catch (error) {
        console.log(error)
    }
}

exports.joinGame = async (req, res, next) => {
    try {
        
        var {tableNumber, password, joiner} = req.body

        var game = await db.Game.findOne({tableNumber: tableNumber}, {_id: 1, tableNumber: 1, password: 1, 'players.p1': 1}).populate('players.p1')
        console.log(game)
        if (game) {
            
            if (game.password === password) {
                
                if (game.players.p1.friends.includes(joiner)) {
                    
                    var gameUpdated = await db.Game.findOneAndUpdate({tableNumber: tableNumber}, {
                        $set: {
                            players: {
                                p1: game.players.p1,
                                p2: joiner
                            },
                            joined: {
                                p1: true,
                                p2: true
                            }
                        }
                    }, {upsert: false})

                    var userUpdate = await db.User.findByIdAndUpdate(joiner, {
                        $push: {
                            games: game._id
                        }
                    })

                    res.json({success: true, msg: 'game joined', gameUpdated: gameUpdated})

                } else {
                    res.json({success: false, msg: 'you are not friends with '+game.players.p1.cred.username+'.'})
                }

            } else {
                res.json({success: false, msg: 'password incorrect'})
            }

        } else {
            res.json({success: false, msg: 'no game found'})
        }

    } catch (error) {
        console.log(error)
    }
}

exports.closeGame = async (req, res, next) => {
    try {
        
        var {tableNumber} = req.body

        var game = await db.Game.findOneAndUpdate({tableNumber: tableNumber}, {$set: {gameIsAlive: false}}, {upsert: false})

        res.json({success: true, msg: 'game is closed', game: game})

    } catch (error) {
        console.log(error)
    }
}

exports.getActiveGames = async (req, res, next) => {
    try {
        
        var {userId} = req.body

        var user = await db.User.findById(userId).populate('games')

        var games = []

        user.games.forEach(g => {
            if (g.gameIsAlive) {
                games.push(g)
            }
        });

        res.json({games, success: true, msg: 'active games found'})

    } catch (error) {
        console.log(error)        
    }
}

exports.getClosedGames = async (req, res, next) => {
    try {
        
        var {userId} = req.body

        var user = await db.User.findById(userId).populate('games')

        var games = []

        user.games.forEach(g => {
            if (!g.gameIsAlive) {
                games.push(g)
            }
        });

        res.json({games, success: true, msg: 'closed games found'})

    } catch (error) {
        console.log(error)        
    }
}
const db = require('../models')

exports.RegisterUser = async (req, res, next) => {
    try {
        
        var {name, age, bio, gender, username, password} = req.body

        var data = {
            personal: {
                name: name,
                age: age,
                gender: gender,
                bio: bio
            },
            cred: {
                username: username,
                password: password
            }
        }


        var users = await db.User.find({}, {_id: 0, 'cred.username': 1})
        var userAlreadyExistsFlag = false
        users.forEach(u => {
            if (u.cred.username === username) {
                userAlreadyExistsFlag = true
            }
        });

        if (userAlreadyExistsFlag) {
            res.json({success: false, msg: 'Username already exists. try another one.'})
        } else {
            var newUser = new db.User(data)

            newUser.save()

            res.json({success: true, msg: 'user registered succesfully', user: newUser})   
        }        

    } catch (error) {
        console.log(error)
    }
}


exports.LoginUser = async (req, res, next) => {
    try {
        var {username,password} = req.body
        var users = await db.User.find({}, {_id: 1, 'cred.username': 1 ,'cred.password': 1})
        var loginmsg = ""
        var userId
        for(var u of users)
        {
            if (u.cred.username === username) {
                if(u.cred.password === password){
                    loginmsg = "success"
                    userId = u._id
                    break    
                }
                else{
                    loginmsg = "wrongpw"
                    break
                }
            }
            else{
                loginmsg = "wrongun"
                
            }
        }
        console.log(userId)
        if(loginmsg === "success" ){
            res.json({success: true, msg: 'user login succesfully', userId: userId})   
        }
        else if(loginmsg === "wrongpw"){
            res.json({success: false, msg: 'Password not match'})   
        }
        else if(loginmsg === "wrongun"){
            res.json({success: false, msg: 'username not found'})   
        }
        else{
            res.json({success: false, msg: 'something went wrong'})   
        }
        
    } catch (error) {
        console.log(error)
    }
}

exports.UserProfile = async (req, res, next) => {
    try {
        console.log(req.params.userId)

        var userId = req.params.userId
        var user = await db.User.findById(userId)
        res.json({success : true, msg: 'user found' , user : user})

    } catch (error) {
        console.log(error)
    }
}

exports.FriendsList = async (req, res, next) => {
    try {
        
        var {userId} = req.params

        var user = await db.User.findById(userId, {friends: 1, friendRequestRecieved: 1})

        res.json({success: true, msg: 'friends found', friends: user.friends, requests: user.friendRequestRecieved})

    } catch (error) {
        console.log(error)
    }
}

exports.getUserByUsername = async (req, res, next) => {
    try {
        
        var {username} = req.body

        var user = await db.User.findOne({
            'cred.username': username
        }, {
            'cred.username': 1,
            personal: 1
        })

        if (user) {
            res.json({success: true, msg: 'user found', user: user})
        } else {
            res.json({success: false, msg: 'user not found'})
        }

    } catch (error) {
        error.status = 400
        console.log(error) 
    }
}

exports.sendFriendRequest = async (req, res, next) => {
    try {
        var {from, to} = req.body

        var fromUser = await db.User.findByIdAndUpdate(from, {
            $push: {
                friendRequestSent: {
                    to: to,
                    pending: true,
                    accepted: false
                }
            }
        }, {
            upsert: false
        })

        var toUser = await db.User.findByIdAndUpdate(to, {
            $push: {
                friendRequestRecieved: {
                    from: from,
                    pending: true,
                    accepted: false
                }
            }
        }, {
            upsert: false
        })

        res.json({success: true, msg: 'friend request transfered', from: fromUser, to: toUser})

    } catch (error) {
        error.status = 400
        console.log(error)
    }
}
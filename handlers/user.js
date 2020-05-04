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

// friends ...
exports.searchUsername = async (req, res, next) => {
    try {
        
        var {searchedUsername, user} = req.body

        var suser = await db.User.findOne({'cred.username': searchedUsername}, {_id: 1, requests: 1, friends: 1, 'personal.name': 1, 'cred.username': 1})

        if (suser) {

            var status

            if (suser._id === user) {
                status = 'self'
            } else {
                if (suser.friends.includes(user)) {
                    status = 'friends' // status A
                } else {
                    var requestsent = await db.Request.findOne({from: user, to: suser._id}, {status: 1})
                    var requestrecieved = await db.Request.findOne({from: suser._id, to: user}, {status: 1})
    
                    if (requestsent) {
                        if (requestsent.status === 'P') {
                            status = 'sentpending'
                        }
                    }
                    if (requestrecieved) {
                        if (requestrecieved.status === 'P') {
                            status = 'recievedpending'                                
                        }
                    }
                    if (!status) {
                        status = 'new'
                    }          
                }            
            }            

            res.json({success: true, msg: 'user found', user: suser, status: status})
        } else {
            res.json({success: false, msg: 'no user found'})
        }
    } catch (error) {
        console.log(error)        
    }
}

exports.sendFriendRequest = async (req, res, next) => {
    try {
        
        var {from , to} = req.body

        var data = {
            from: from,
            to: to,
            status: 'P'
        }
        var user = await db.User.findById(to, {'cred.username': 1, _id: 0})

        var request = new db.Request(data)

        await request.save()

        res.json({request: request, success: true, msg: 'sent', username: user.cred.username})

    } catch (error) {
        console.log(error)
    }
}

exports.getRequestList = async(req, res, next) => {
    try {
        
        var {to} = req.params

        var list = await db.Request.find({to: to}, {from: 1, _id: 0}).populate('from')

        res.json({success: true, msg: 'list found', list: list})

    } catch (error) {
        console.log(error)
    }
}
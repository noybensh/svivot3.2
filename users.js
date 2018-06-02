var express = require('express');
var router = express.Router();
var DButilsAzure = require('./DButils');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
const superSecret = "SUMsumOpen"; 





router.post('/register', function(req,res)

{
DButilsAzure.execQuery("insert into users ( userName,fName, lName,password,email, country,city,q, ans) VALUES "+
 "('" + req.body.userName+"','"+
req.body.fName + "','" + req.body.lName + "','" + req.body.password + "','"+ 
req.body.email + "','" + req.body.country + "','"+ req.body.city + "','"+ req.body.q + "','" + req.body.ans +
 "')" )


.then(function(result){
    res.sendStatus(200);
})
.catch(function(err){
    res.send('The user is allready exists');
})

var category = req.body.category;
for(var i=0; i< category.length ; i++)
{
    DButilsAzure.execQuery("insert into userCategory (userName , category) VALUES " +
    "('" + req.body.userName + "','" + category[i] + "')")
    .then(function(result){
        res.sendStatus(200);
    })
    .catch(function(err){
        res.send('err')
    })
}

});

router.post('/logIn', function (req, res) {

    var user = req.body.userName

    if (!user || !req.body.password )
        res.send({ message: "bad values" })

    else {
        DButilsAzure.execQuery("select * from users where userName = '" + user + "'"   )
        .then(function(result)
    {
        if( req.body.password == result[0].password)
        {

            var user1 = {
                "userName": user
            }
            
            sendToken(user1, res)
        }
        else{
            res.send('incorrect password');
        }
    })

    .catch(function(err)
{
    res.send('No such userName')
})
    }});


    function sendToken(user, res) {
        var payload = {
            userName: user.userName
        }
    
        var token = jwt.sign(payload, superSecret, {
            expiresIn: "1d" // expires in 24 hours
        });
    
        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            user: user
        });
    
    }
    

   /*     for (id in Users) {
            var user = Users[id]

            if (req.body.userName == user.userName)
                if (req.body.password == user.password)
                    sendToken(user, res)
                else {
                    res.send({ success: false, message: 'Authentication failed. Wrong Password' })
                    return
                }

        }

        res.send({ success: false, message: 'Authentication failed. No such user name' })
    }

});*/


router.post('/passwordRestor', function (req,res){
    var user = req.body.userName;
    var q = req.body.q;
    var ans = req.body.ans;
    DButilsAzure.execQuery("select password from users where userName = '"
     + user + "' AND q = '" + q + "'AND ans = '"+ ans + "'")
    .then(function(result){
        res.send(result[0].password);
    })
    .catch(function(err){
        res.send('The answer is incorrect');
    })

});

module.exports = router;
var express = require('express');
var router = express.Router();
var DButilsAzure = require('./DButils');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
const superSecret = "SUMsumOpen"; 
let forRank=0;


// route middleware to verify a token
router.use('/reg', function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, superSecret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                // get the decoded payload and header
                var decoded = jwt.decode(token, {complete: true});
                req.decoded= decoded;
                console.log(decoded.header);
                console.log(decoded.payload)
            
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }

})

router.get('/reg/categoryTwo', function (req, res){
    

   // req.decoded.userName
    DButilsAzure.execQuery("select category from userCategory where userName ='" + req.decoded.payload.userName + "'")
    .then ( function(result){
    var random1= Math.floor((Math.random() * result.length)) ;   
    var first= result[random1].category;

    if(result.length>1){
        var random2 = Math.floor((Math.random() * result.length)) ;
        var second = result[random2].category;
        while(first===second)
        {
            var random2 = Math.floor((Math.random() * result.length)) ;
            var second = result[random2].category;
        }
    }
        
    DButilsAzure.execQuery("select * from poi where category = '" + first + "' or category = '" + second + "'" )
    .then(function(result)
 {

    var random3= Math.floor((Math.random() * result.length)) ;   
    var r1= result[random3];

    if(result.length>1){
        var random4 = Math.floor((Math.random() * result.length)) ;
        var r2 = result[random4];
        while(r1.category===r2.category)
        {
            random4 = Math.floor((Math.random() * result.length)) ;
            r2 = result[random2];
        }
    }
     
    
    var poiTwo={
        firstPoi: r1,
        secondPoi : r2
    }

     res.send(poiTwo)
 })

   })
    .catch(function(err){
        res.send(err)
    })
});



router.post('/reg/addRank/', function (req, res, next) {

        var poiID = req.body.poiID
    
        var rank = req.body.rank
    
        var review = req.body.review
    
        var date = new Date().toISOString();
    
        var rankN = 0;
    
        DButilsAzure.execQuery("insert into poiReview (userName, date, review,poiID, rank) values ('"+ req.decoded.payload.userName+ "','" + date + "','" 
       + review + "','" + poiID+"'," + rank + ")")
       .then(function (result) {
           
        DButilsAzure.execQuery("select rank from poiReview where poiID=" + poiID)
        .then(function (result) {

            for (var i = 0; i < result.length; i++) {
    
                rankN = rankN+ result[i].rank;
    
            }
            rankN = (rankN / (result.length )) ;
            rankN= (rankN*100)/10;
      
            DButilsAzure.execQuery("update poi set rank= " + rankN + " where poiID ='" + poiID + "'")
            .then(function (result) {
    
               res.send("Review Added")
    
            })
    
        }).catch(function (err) {
    
            res.send(err);
    
        })
        }).catch(function(err)
    
        {
            res.send("The same review from this user exists");
        })
    })

router.post('/reg/saveFavPoi', function(req, res){
    var username = req.decoded.payload.userName;
    var poiID = req.body.poiID ; 
    var place = 1;

    DButilsAzure.execQuery("select place from userFav where userName = '" + username + "'")
    .then(function(result)
{
    if(result.length>=1)
    {
        console.log(result.length )   
        place = result.length+1;
    }
  
    console.log(place)
    DButilsAzure.execQuery("insert into userFav (userName, poiID , place) VALUES " + "('" +username + "','" + poiID + "'," +place +")")
    .then(function(result){
        res.send('user added favorite place' );
    })
    .catch(function(err){
        res.send(err);
    })

})
.catch(function(err)
{
    res.send(err)
})


   
 });

 //get all favorite to specific user
router.get('/reg/favePOI',function(req,res){
    var username=req.decoded.payload.userName;
    var poiFva=[]
    DButilsAzure.execQuery("SELECT * FROM poi inner join userfav  on userfav.userName = '"+  username + "' AND poi.poiID = userfav.poiID ")
    .then(function(result){   
        res.send(result)
    })
    .catch(function(err){
        res.send(err);
    })
});

router.get('/reg/twofavePOI',function(req,res){
    var username=req.decoded.payload.userName;
    var poiFva=[]
    DButilsAzure.execQuery("SELECT name,category,description,rank, numWatch, picture FROM poi inner join userfav  on userfav.userName = '"+  username + "' AND poi.poiID = userfav.poiID order by place")
    .then(function(result){
        
        var twoLast = {
            poi1: result[result.length-2],
            poi2: result[result.length-1],
        }
        res.send(twoLast);
    })
    .catch(function(err){
        res.send(err);
    })
});

//delet from favorite
router.delete('/reg/deleteFavPOI',function(req,res){
    var username=req.decoded.payload.userName;
    var poiID=req.body.poiID;

 
        DButilsAzure.execQuery("DELETE FROM userFav WHERE username='"+ username+"' AND poiID='" + poiID +"'")
        .then(function(result){
            res.send('point of interest deleted from your favorits');
        })
   
    .catch(function(err){
        res.send(err);
    })

});



module.exports = router;
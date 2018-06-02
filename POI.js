var express = require('express');
var router = express.Router();
var DButilsAzure = require('./DButils');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
const superSecret = "SUMsumOpen"; 

router.get('/getPoi/:id', function (req, res){
   // res.send('fff');
   let poiID = req.params.id;
   //res.send(poiID); 
    DButilsAzure.execQuery("select * from poi where poiID = '" + poiID + "'")
    .then (function (result){
        if(result.length>0)
        res.send(result);
        else
        res.send('no such point of interest') 
    })
    .catch(function(err){
        res.send('no such point of interest')
    })
});

router.get ('/getPoiByName/:name', function (req, res){
    let poiName = req.params.name;
    DButilsAzure.execQuery("select * from poi where name = '" + poiName + "'")
    .then (function (result){
        if(result[0].length!=0){
            for (var i = 0 ; i < result.length ; i++){
                res.send(result[i]);
            }
        }
    })
    .catch(function(err){
        res.send('no such point of interest')
    })
 });

router.get('/getAllPoi', function (req, res){

    
     DButilsAzure.execQuery("select * from poi")
     .then (function (result){
     
       
      
        if(result.length!=0){
            res.send(result);
           } 
       
       

         
     })
     .catch(function(err){
         res.send('no such point of interest')
     })
 });

 router.get('/random3', function (req, res){
    DButilsAzure.execQuery("select * from poi where rank >= 3")
    .then ( function(result){
       // res.send(result);
       let size = result.length ; 
       //3 random different places
       var random1 = Math.floor((Math.random() * size));
       if (size > 1){
           var random2 = Math.floor((Math.random() * size));
           while (random1 === random2){
               random2 = Math.floor((Math.random() * size));
           }
       }
       if (size>2){
           var random3 = Math.floor((Math.random() * size));
           while (random1 === random3 || random2 === random3){
               random3 = Math.floor((Math.random() * size));
           }
       }
 
       
       var random3POI = {
           poi1: result[random1],
           poi2: result[random2],
           poi3: result[random3]
       }
       res.send(random3POI);
   })
    .catch(function(err){
        res.send(err)
    })
});



module.exports = router;


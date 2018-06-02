//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var cors = require('cors');
app.use(cors());

var DButilsAzure = require('./DButils');
var users = require('./users');
var poi = require('./poi');
var poiUser = require('./poiUser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

var superSecret = "NoyYahalom";

app.use('/users' , users);
app.use('/poi' , poi);
app.use('/poiUser' , poiUser);


/*app.get('/:un', function(req,res)
{
    var un=req.params.un
    console.log(un)
        DButilsAzure.execQuery("select * from users").then(function(response)
{
    var rel=response;
    res.send('ddddd')
}).catch(function(err){
    res.send(err)
})
});*/


//complete your code here




var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------



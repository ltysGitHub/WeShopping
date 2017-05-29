/**
 * Created by 刘腾营 on 2017/5/19.
 */
let express = require('express');
let path = require('path');
let index = require('./routers/index');
let login = require('./routers/login');
let signup = require('./routers/signup');
let partials = require('express-partials');
let app = express();

app.set('views', './views');
app.use('/static',express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use('/',index);
app.use('/login',login);
app.use('/signup',signup);

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
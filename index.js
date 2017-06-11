/**
 * Created by 刘腾营 on 2017/5/19.
 */
let express = require('express');
let path = require('path');
let index = require('./routers/index');
let login = require('./routers/login');
let logout = require('./routers/logout');
let signup = require('./routers/signup');
let user = require('./routers/user');
let partials = require('express-partials');
let bodyParser = require("body-parser");
let session = require('express-session');
let cookieParser = require('cookie-parser');

let app = express();

app.set('views', './views');
app.use('/static',express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(bodyParser.urlencoded({extended:false}));

app.use(cookieParser());

app.use(session({
    secret:"lty'WeShopping",
    name:'WeShopping',
    resave:true,
    rolling:true,
    saveUninitialized:false,
    cookie:{maxAge:1500000}
}));

app.use('/',index);
app.use('/login',login);
app.use('/logout',logout);
app.use('/signup',signup);
app.use('/user',user);

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
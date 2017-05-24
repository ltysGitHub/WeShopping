/**
 * Created by 刘腾营 on 2017/5/19.
 */
let express = require('express');
let index = require('./routers/index');
let path = require('path')
let partials = require('express-partials');
let app = express();

app.set('views', './views');
app.use('/static',express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use('/',index);

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
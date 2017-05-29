/**
 * Created by 刘腾营 on 2017/5/19.
 */
let express = require('express');
let router = express.Router();
let ejs = require('ejs');

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', function(req, res){
    res.render('index');
});

router.get('/index', function(req, res){
    res.render('index');
});

router.get('/index.html', function(req, res){
    res.render('index');
});


module.exports = router;
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
    // req.session.user = "中文测试";
    if(typeof req.session.userId === 'string'){
        res.render('index',{userHeader:"../static/image/user.png"});
    }else{
        res.render('index');
    }

});

router.get('/index', function(req, res){
    if(typeof req.session.userId === 'string'){
        console.log(req.session.userId);
        res.render('index',{userHeader:"../static/image/user.png"});
    }else{
        console.log('no login');
        res.render('index');
    }
    // console.log(req.session.user);
    // req.session.user = "中文测试";
    // res.render('index');
});

router.get('/index.html', function(req, res){
    if(typeof req.session.userId === 'string'){
        console.log(req.session.userId);
        res.render('index',{userHeader:"../static/image/user.png"});
    }else{
        console.log('no login');
        res.render('index');
    }
});


module.exports = router;
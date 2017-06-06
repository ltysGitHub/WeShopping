/**
 * Created by 刘腾营 on 2017/6/4.
 */
let express = require('express');
let router = express.Router();
let mysql = require('../mysql/Mysql');


router.use(function timeLog(req, res, next) {
    console.log('login Time222: ', Date.now());
    next();
});


router.post('/',(req,res)=>{
    if(req.session.userId){
        delete req.session.userId;
    }
    let back = {status:0};
    res.send(back);
});

module.exports = router;
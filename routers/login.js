/**
 * Created by 刘腾营 on 2017/5/27.
 */
let express = require('express');
let router = express.Router();
let mysql = require('../mysql/Mysql');


router.use(function timeLog(req, res, next) {
    console.log('login Time222: ', Date.now());
    next();
});


router.post('/',(req,res)=>{
    if(typeof req.body.user !== 'string' || typeof req.body.passwd !== 'string'){
        let back = {status:1};
        res.send(back);
    }else{
        new mysql("root","liutengying").checkUser({user:req.body.user,passwd:req.body.passwd}).then((back)=>{
            //console.log(back);
            if(back.result === true){
                req.session.userId = back.userId;
            }
            console.log(back);
            res.send(back);
        }).catch((back)=>{
            res.send(back);
        });
    }
});

module.exports = router;
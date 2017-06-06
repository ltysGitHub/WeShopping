/**
 * Created by 刘腾营 on 2017/5/31.
 */

let express = require('express');
let router = express.Router();
let mysql = require('../mysql/Mysql');

router.post('/header', function(req, res){
    if(typeof req.session.userId === 'string'){

    }else{
        let back = {status:10};
        res.send(back);
    }
});

router.post('/info', function(req, res){
    if(typeof req.session.userId === 'string'){
        new mysql("root","liutengying").getUserInfoById(req.session.userId).then((back)=>{
            res.send(back);
        }).catch((back)=>{
            res.send(back);
        });
    }else{
        let back = {status:10};
        res.send(back);
    }
});


module.exports = router;
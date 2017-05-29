/**
 * Created by 刘腾营 on 2017/5/27.
 */

let express = require('express');
let router = express.Router();
let mysql = require('../mysql/Mysql');

router.use(function timeLog(req, res, next){
    console.log('login Time: ', Date.now());
    next();
});

router.post('/',(req,res)=>{
    console.log(req.query);
    let info = {name:req.query.name,phone:req.query.phone,email:req.query.email,passwd:req.query.passwd,sex:req.query.sex};
    new mysql("root","liutengying").addUser(info)
        .then((back)=>{
            res.send(back);
            console.log(back);
        })
        .catch((back)=>{
            res.send(back);
            console.log(back);
        });
});

router.post('/check/email',(req,res)=>{
    console.log(req.body);
    let email = req.query.email;
    new mysql("root","liutengying").checkEmail(email)
        .then((back)=>{
            res.send(back);
            console.log(back);
        })
        .catch((back)=>{
            res.send(back);
            console.log(back);
        });
});

router.post('/check/phone',(req,res)=>{
    console.log(req.body);
    let phone = req.query.phone;
    new mysql("root","liutengying").checkPhone(phone)
        .then((back)=>{
            res.send(back);
            console.log(back);
        })
        .catch((back)=>{
            res.send(back);
            console.log(back);
        });
});


module.exports = router;
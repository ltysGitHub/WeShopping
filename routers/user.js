/**
 * Created by 刘腾营 on 2017/5/31.
 */

let express = require('express');
let router = express.Router();
let mysql = require('../mysql/Mysql');
let uuid = require('uuid');

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

router.post('/good', function(req, res){
    if(typeof req.session.userId === 'string'){
        new mysql("root","liutengying").getGoodInfo(req.session.userId).then((back)=>{
            // console.log(back);
            for(let i = 0;i < back.result.length;i++){
                back.result[i].goodPrice = ""+back.result[i].goodPrice;
                back.result[i].goodRest = ""+back.result[i].goodRest;
                back.result[i].goodDiscount = ""+back.result[i].goodDiscount;
            }
            res.send(back.result);
        }).catch((back)=>{
            // console.log(back);
            res.send({});
        });
    }else{
        let back = {status:10};
        res.send(back);
    }
});

router.post('/deleteGood', function(req, res){
    if(typeof req.session.userId === 'string' && typeof req.body.goodId === 'string'){
        new mysql("root","liutengying").deleteGood({seller:req.session.userId,goodId:req.body.goodId}).then((back)=>{
            res.send(back);
        }).catch((back)=>{
            res.send(back);
        });
    }else{
        res.send({status:10});
    }
});

router.post('/createId',function(req,res){
    if(typeof req.session.userId === 'string'){
        let id = uuid.v1();
        let back = {status:0,result:id};
        res.send(back);
    }else{
        let back = {status:1};
        res.send(back);
    }
});

router.post('/addOrUpdateGood', function(req, res){
    if(typeof req.session.userId === 'string'){
        req.body.seller = req.session.userId;
        if(typeof req.body.price === "string"){
            req.body.price = parseFloat(req.body.price);
        }
        if(typeof req.body.discount === "string"){
            req.body.discount = parseFloat(req.body.discount);
        }
        if(typeof req.body.rest === "string"){
            req.body.rest = parseInt(req.body.rest);
        }
        new mysql("root","liutengying").addOrUpdateGood(req.body).then((back)=>{
            console.log(back);
            res.send(back);
        }).catch((back)=>{
            console.log(back);
            res.send(back);
        });
    }else{
        let back = {status:10};
        res.send(back);
    }
});



module.exports = router;
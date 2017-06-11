/**
 * Created by 刘腾营 on 2017/5/31.
 */

let express = require('express');
let router = express.Router();
let mysql = require('../mysql/Mysql');
let uuid = require('uuid');
let multer = require('multer');
let fs= require("fs");

let upload = multer({dest:'../public/images/'});

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
            res.send([]);
        });
    }else{
        let back = {status:10};
        res.send([]);
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


function copyFile(file,des){
    return new Promise((resolve,reject)=>{
        fs.unlink(des+"/0.png",(err)=>{
            fs.rename("../public/images/"+file.filename,des+"/0.png",function(err) {
                if(err){
                    console.log(err);
                    reject();
                }else{
                    resolve();
                }
            });
        });
    });
}

// function copyFiles(files,des){
//     return new Promise((resolve,reject)=>{
//         let promisesfunc = files.map(function(file,index,array){
//             console.log("aaa"+index);
//             // return function(){
//             //     return new Promise((resolve,reject)=>{
//             //         console.log(index);
//             //         fs.unlink(des+"/"+index+".png",(err)=>{
//             //             fs.rename("../public/images/"+file.filename,des+"/"+index+".png",function(err){
//             //                 if(err){
//             //                     console.log(err);
//             //                     reject();
//             //                 }else{
//             //                     resolve();
//             //                 }
//             //             });
//             //         });
//             //     });
//             // };
//         });
//
//         let promisefuncs = new Array();
//         let promises = new Array();
//
//         for(i in files){
//             console.log("aaasss"+i);
//         }
//
//         for(var i = 0;i < files.length; i++){
//             console.log("bbb"+i);
//             // (function(i){
//             //     promises.push(copyFile(files[i],i,des));
//             //     // promises.push(new Promise((resolve,reject)=>{
//             //     //     console.log(index);
//             //     //     fs.unlink(des+"/"+index+".png",(err)=>{
//             //     //         fs.rename("../public/images/"+files[index].filename,des+"/"+index+".png",function(err){
//             //     //             if(err){
//             //     //                 console.log(err);
//             //     //                 reject();
//             //     //             }else{
//             //     //                 resolve();
//             //     //             }
//             //     //         });
//             //     //     });
//             //     // }));
//             // }(i));
//         }
//         // console.log(promisefuncs);
//         // let promises = promisefuncs.map(function(func){
//         //     let promise = func();
//         //     return promise;
//         // });
//
//         // console.log(promises);
//         // Promise.all(promises).then(()=>{
//         //     resolve();
//         // }).catch(()=>{
//         //     reject();
//         // });
//         resolve();
//     });
// }

router.post('/uploadGoodPic',upload.array('goodPic',1),function(req, res){
    console.log(req.files);
    // console.log(req.body.goodId);
    if(typeof req.session.userId === 'string' && typeof req.body.goodId === "string"){
        // console.log(req.files);
        new mysql("root","liutengying").checkGoodSeller(req.body.goodId,req.session.userId).then((back)=>{
            if(back.status === 0){
                fs.exists("public/goodPic/"+req.body.goodId,(exits)=>{
                    if(!exits){
                        fs.mkdir("public/goodPic/"+req.body.goodId,(err)=>{
                            if(err){
                                console.log(err);
                                res.send({error:"服务器异常"});
                            }else{
                                copyFile(req.files[0],"public/goodPic/"+req.body.goodId).then(()=>{
                                    res.send({});
                                }).catch(()=>{
                                    res.send({error:"服务器异常"});
                                });
                            }
                        });
                    }else{
                        copyFile(req.files[0],"public/goodPic/"+req.body.goodId).then(()=>{
                            res.send({});
                        }).catch(()=>{
                            res.send({error:"服务器异常"});
                        });
                    }
                });
            }else{
                res.send({error:"操作不合法"});
            }
        }).catch((back)=>{
            res.send({error:"服务器异常"});
        });
    }else{
        res.send({error:"操作不合法"});
    }
});

router.post('/loadGood', function(req, res){
    console.log(req.body);
    if(typeof req.body.page !== 'number'){
        req.body.page = 0;
    }
    console.log(req.body);
    new mysql("root","liutengying").getGood(req.body).then((back)=>{
        res.send(back);
    }).catch((back)=>{
        res.send(back);
    });
});

router.post('/addOrder', function(req, res){
    console.log(req.body);
    if(typeof req.body.goodId !== 'string' || typeof req.body.addr !== 'string' || typeof req.body.num !== 'string'){
        // console.log(typeof req.body.num);
        // console.log(req.body.num);
        res.send({status:1});
    }else{
        if(typeof req.session.userId === 'string'){
            let info = {good:req.body.goodId,addr:req.body.addr,buyer:req.session.userId,num:parseInt(req.body.num)};
            if(typeof req.body.message != "string"){
                info.message = "";
            }else{
                info.message = req.body.message;
            }
            new mysql("root","liutengying").addOrder(info).then((back)=>{
                console.log("awe"+back);
                res.send(back);
            }).catch((back)=>{
                console.log("asdd"+back);
                res.send(back);
            });
        }else{
            res.send({status:10});
        }
    }
});

// router.post('/cancelOrder', function(req, res){
//     console.log(req.body);
//     if(typeof req.body.goodId !== 'string' || typeof req.body.addr !== 'string' || typeof req.body.num !== 'string'){
//         // console.log(typeof req.body.num);
//         // console.log(req.body.num);
//         res.send({status:1});
//     }else{
//         if(typeof req.session.userId === 'string'){
//             let info = {good:req.body.goodId,addr:req.body.addr,buyer:req.session.userId,num:parseInt(req.body.num)};
//             if(typeof req.body.message != "string"){
//                 info.message = "";
//             }else{
//                 info.message = req.body.message;
//             }
//             new mysql("root","liutengying").addOrder(info).then((back)=>{
//                 console.log("awe"+back);
//                 res.send(back);
//             }).catch((back)=>{
//                 console.log("asdd"+back);
//                 res.send(back);
//             });
//         }else{
//             res.send({status:10});
//         }
//     }
// });

router.post('/getGoodInfoById', function(req, res){
    // console.log(req.body);
    if(typeof req.body.goodId !== 'string'){
        res.send({status:1});
    }else{
        if(typeof req.session.userId === 'string'){
            new mysql("root","liutengying").getGoodInfoById(req.body.goodId).then((back)=>{
                res.send(back);
            }).catch((back)=>{
                res.send(back);
            });
        }else{
            res.send({status:10});
        }
    }
});

router.post('/order', function(req, res){
    if(typeof req.session.userId === 'string'){
        new mysql("root","liutengying").getOrderByUser(req.session.userId).then((back)=>{
            res.send(back.result);
        }).catch((back)=>{
            console.log(back);
            res.send([]);
        });
    }else {
        res.send([]);
    }
});

router.post('/deleteOrder', function(req, res){
    if(typeof req.session.userId === 'string' && typeof req.body.orderId === 'string'){
        new mysql("root","liutengying").deleteOrder(req.session.userId,req.body.orderId).then((back)=>{
            res.send(back);
        }).catch((back)=>{
            console.log(back);
            res.send(back);
        });
    }else {
        res.send({status:11});
    }
});

router.post('/alterOrder', function(req, res){
    if(typeof req.session.userId === 'string' && typeof req.body.orderId === 'string' && typeof req.body.status === 'string'){
        new mysql("root","liutengying").alterOrderstatus(req.session.userId,req.body.orderId,req.body.status).then((back)=>{
            res.send(back);
        }).catch((back)=>{
            console.log(back);
            res.send(back);
        });
    }else {
        res.send({status:11});
    }
});

//
// [1,2,3,4,5,67,8].map(function(e,index,array){
//     console.log(index);
// });





module.exports = router;
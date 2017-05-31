/**
 * Created by 刘腾营 on 2017/5/31.
 */

let express = require('express');
let router = express.Router();
let ejs = require('ejs');

router.get('/header', function(req, res){
    let back = {status:1}
    if(typeof req.session.UserId === 'string'){

    }
    res.send(back);
});

router.get('/info', function(req, res){
    let back = {status:1}
    res.send(back);
});


module.exports = router;
/**
 * Created by 刘腾营 on 2017/5/27.
 */
let express = require('express');
let router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('login Time: ', Date.now());
    next();
});

// router.get('/',(req,res)=>{
//     res.send('abcdefg');
// });

router.post('/',(req,res)=>{
    res.send('abcdefghi');
});

module.exports = router;
/**
 * Created by 刘腾营 on 2017/5/27.
 */

let mysql = require('mysql');
let uuid = require('uuid');

class Mysql{
    constructor(user,passwd){
        this.host = 'localhost';
        this.user = user;
        this.passwd = passwd;
        this.database = 'WeShopping';
    }

    /**
     * 添加用户操作。
     * @param info typeof info.email === 'string'，typeof info.phone === 'string'， typeof info.passwd === 'string'， typeof info.name == 'string'
     * @returns {Promise} back
     */
    addUser(info){
        return new Promise((resolve,reject)=>{
            if(typeof info.email !== 'string' || typeof info.phone !== 'string' || typeof info.type !== 'string' || typeof info.passwd !== 'string' || typeof info.name !== 'string'){
                console.log(info);
                let back = {status:1};
                reject(back);
            }else if(info.name === "" || info.phone === "" || info.passwd === "" || info.email === "" || info.sex === ""){
                let back = {status:1};
                reject(back);
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                info.email = con.escape(info.email);
                info.phone = con.escape(info.phone);
                info.passwd = con.escape(info.passwd);
                info.type = con.escape(info.type);
                info.name = con.escape(info.name);
                let sql = `select COUNT(*) count from users where
                            users.phone = ${info.phone}
                            or users.email = ${info.email}`;
                con.query(sql,(err,result)=>{
                    if(err){
                        console.log(err);
                        let back = {status:2};
                        reject(back);
                    }else{
                        // console.log(result[0].count);
                        if(result[0].count == 0){
                            con.beginTransaction((err)=>{
                                if(err){
                                    let back = {status:3};
                                    reject(back);
                                }else{
                                    let id = uuid.v1();

                                    let sql = `insert into users(id,name,email,phone,type`;
                                    if(typeof info.sex === 'string'){
                                        info.sex = con.escape(info.sex);
                                        sql += `,sex) values('${id}',${info.name},${info.email},${info.phone},${info.type},${info.sex});`;
                                    }else{
                                        sql +=`) values('${id}',${info.name},${info.email},${info.phone},${info.type});`;
                                    }

                                    console.log(sql);

                                    con.query(sql,(err,result)=>{
                                        if(err){
                                            console.log(err);
                                            con.rollback(()=>{
                                                let back = {status:4};
                                                reject(back);
                                            });
                                        }else{
                                            let sql = `insert into pwd(id,pw) values('${id}',${info.passwd});`;
                                            con.query(sql,(err,result)=>{
                                                if(err){
                                                    con.rollback((err)=>{
                                                        let back;
                                                        if(err){
                                                            console.log(err);
                                                            back = {status:5};
                                                        }else{
                                                            back = {status:6};
                                                        }
                                                        con.end();
                                                        reject(back);
                                                    });
                                                }else{
                                                    con.commit((err,result)=>{
                                                        if(err){
                                                            con.rollback((err)=>{
                                                                if(err){
                                                                    console.log(err);
                                                                }
                                                                con.end();
                                                                let back = {status:7};
                                                                reject(back);
                                                            });
                                                        }else{
                                                            let back = {status:0,result:id};
                                                            con.end();
                                                            resolve(back);
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }else{
                            let back = {status:8};
                            reject(back);
                        }
                    }
                });
            }
        })
    }

    /**
     * 检查邮箱是否存在
     * @param email     邮箱
     * @returns {Promise}   参数{status:***,result:***}，若存在则返回true，不存在返回false
     */
    checkEmail(email){
        return new Promise((resolve,reject)=>{
            if(typeof email === 'undefined'){
                let back = {status:1};
                reject(back);
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                email = con.escape(email);
                let sql = `select COUNT(*) count from users
                        where email = ${email}`;
                con.query(sql,(err,result)=>{
                    if(err){
                        console.log(err);
                        let back = {status:1};
                        con.end();
                        reject(back);
                    }else{
                        if(result[0].count == 0){
                            let back = {status:0,result:false};
                            con.end();
                            resolve(back);
                        }else{
                            let back = {status:0,result:true};
                            con.end();
                            resolve(back);
                        }
                    }
                });
            }

        });
    }

    /**
     * 检查手机号是否存在
     * @param phone
     * @returns {Promise}  {status:***,result:***}，若存在则返回true,否则返回false
     */
    checkPhone(phone){
        return new Promise((resolve,reject)=>{
            if(typeof phone === 'undefined'){
                let back = {status:1};
                reject(back);
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                phone = con.escape(phone);
                let sql = `select COUNT(*) count from users
                            where phone = ${phone}`;
                con.query(sql,(err,result)=>{
                    if(err){
                        console.log(err);
                        let back = {status:1};
                        con.end();
                        reject(back);
                    }else{
                        if(result[0].count == 0){
                            let back = {status:0,result:false};
                            con.end();
                            resolve(back);
                        }else{
                            let back = {status:0,result:true};
                            con.end();
                            resolve(back);
                        }
                    }
                });
            }
        });
    }

    /**
     * 验证用户登录
     * @param info 包含user、passwd键
     * @returns {Promise}   如果登录成功，返回result:true，UserId失败则返回result:false，异常则返回status:***
     */
    checkUser(info){
        return new Promise((resolve,reject)=>{
            if(typeof info.user !== 'string' || typeof info.passwd !== 'string'){
                let back = {status:1};
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                info.user = con.escape(info.user);
                info.passwd = con.escape(info.passwd);
                let sql = `select COUNT(*) count,users.id from users,pwd
                            where (users.phone = ${info.user} or users.email = ${info.user}) and users.id = pwd.id and pwd.pw = ${info.passwd};`
                con.query(sql,(err,result)=>{
                    if(err){
                        // console.log(err.message);
                        let back = {status:2};
                        con.end();
                        reject(back);
                    }else{
                        let back = {status:0};
                        con.end();
                        if(result[0].count === 0){
                            back.result = false;
                        }else{
                            back.result = true;
                            back.userId = result[0].id;
                        }
                        resolve(back);
                    }
                });
            }
        });
    }

    /**
     * 根据用户Id获取用户信息
     * @param userId
     * @returns {Promise} 获取成功时，status为0，result为信息json，否则status为错误代码，没有result
     */
    getUserInfoById(userId){
        return new Promise((resolve,reject)=>{
            if(typeof userId !== 'string'){
                let back = {status:1};
                reject(back);
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                userId = con.escape(userId);
                let sql = `select * from users
                            where id = ${userId};`;
                con.query(sql,(err,result)=>{
                    if(err){
                        con.end();
                        // console.log(err);
                        let back = {status:2};
                        reject(back);
                    }else{
                        con.end();
                        // console.log(result);
                        if(result.length === 0){
                            let back = {status:3};
                            reject(back);
                        }else{
                            let back ={status:0,result:result[0]};
                            resolve(back);
                        }
                    }
                });
            }
        });
    }

    /**
     * 添加订单
     * @param info
     * @returns {Promise}
     */
    addOrder(info){
        return new Promise((resolve,reject)=>{
            if(typeof info.good !== 'string' || typeof info.buyer !== 'string' || typeof info.num !== 'number' || typeof info.addr !== 'string' || typeof info.message !== 'string'){
                let back = {status:1};
                reject(back);
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                info.good = con.escape(info.good);
                info.buyer = con.escape(info.buyer);
                info.addr = con.escape(info.addr);
                info.message = con.escape(info.message);
                let sql = `select * from goods
                            where id = ${info.good}`;
                con.query(sql,(err,result)=>{
                    if(err){
                        con.end();
                        let back = {status:2};
                        reject(back);
                    }else{
                        if(result.length === 0 || result[0].rest < info.num){
                            con.end();
                            let back = {status:13};
                            reject(back);
                        }else{
                            let goodInfo = result[0];
                            con.beginTransaction((err)=>{
                                if(err){
                                    con.end();
                                    let back = {status:4};
                                    reject(back);
                                }else{
                                    let newRest = result[0].rest - info.num;
                                    let sql = `update goods set rest = ${newRest}
                                                where id = ${info.good};`
                                    info.price = result[0].price*result[0].discount;
                                    con.query(sql,(err,result)=>{
                                        if(err){
                                            con.rollback();
                                            con.end();
                                            let back = {status:5};
                                            reject(back);
                                        }else{
                                            let id = uuid.v1();
                                            let date = new Date().toLocaleString();
                                            let sql = `insert into orders(id,orderDate,good,num,buyer,seller,addr,price,message,status)
                                                        values('${id}','${date}',${info.good},${info.num},${info.buyer},'${goodInfo.seller}',${info.addr},${info.price},${info.message},'u');`
                                            con.query(sql,(err,result)=>{
                                                if(err){
                                                    con.rollback();
                                                    con.end();
                                                    let back = {status:6};
                                                    reject(back);
                                                }else{
                                                    con.commit((err)=>{
                                                        if(err){
                                                            con.rollback();
                                                        }
                                                        con.end();
                                                    });
                                                    let back = {status:0};
                                                    resolve(back);
                                                }
                                            });
                                        }
                                    })
                                }
                            });
                        }
                    }
                })
            }
        });
    }

    /**
     *
     * @param goodId
     * @returns {*}
     */
    getGoodInfoById(goodId){
        return new Promise((resolve,reject)=>{
            if(typeof goodId !== "string"){
                reject({status:1});
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                goodId = con.escape(goodId);
                let sql = `select * from goods
                            where id = ${goodId}`;
                // console.log(sql);
                con.query(sql,(err,result)=>{
                    con.end();
                    if(err){
                        reject({status:2});
                    }else{
                        resolve({status:0,result:result});
                    }
                });
            }
        });
    }

    /**
     *
     * @param info
     * @returns {*}
     */
    insertGood(info){
        return new Promise((resolve,reject)=>{
            if(typeof info.id !== 'string' || typeof info.name !== 'string' ||typeof info.rest !== 'number' ||typeof info.price !== 'number'  ||typeof info.seller !== 'string'){
                console.log(info);
                let back = {status:1};
                reject(back);
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                info.id = con.escape(info.id);
                info.name = con.escape(info.name);
                info.price = con.escape(info.price);
                info.rest = con.escape(info.rest);
                info.seller = con.escape(info.seller);
                let sql = `insert into goods(id,name,rest,saleVolume,price,seller`
                let values = ` values(${info.id},${info.name},${info.rest},0,${info.price},${info.seller}`;
                if(typeof info.class === "string"){
                    sql += `,class`;
                    info.class = con.escape(info.class);
                    values += `,${info.class}`;
                }
                if(typeof info.tag === "string"){
                    sql += `,tag`;
                    info.tag = con.escape(info.tag);
                    values += `,${info.tag}`;
                }
                if(typeof info.discount === "number"){
                    sql += `,discount`;
                    info.discount = con.escape(info.discount);
                    values += `,${info.discount}`;
                }else{
                    sql += `,discount`;
                    values += `,1.0`;
                }
                sql += `)`;
                values += `);`;
                sql += values;
                console.log(sql);
                con.query(sql,(err,result)=>{
                    if(err){
                        console.log(err);
                        let back = {status:1};
                        con.end();
                        reject(back);
                    }else{
                        let back = {status:0};
                        con.end();
                        resolve(back);
                    }
                });
            }
        })
    }


    /**
     *
     * @param info
     * @returns {*}
     */
    updateGood(info){
        return new Promise((resolve,reject)=>{
            if(typeof info.id !== "string"){
                reject({status:1});
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                info.id = con.escape(info.id);
                let sql = `update goods `;
                if(typeof info.class === "string"){
                    info.class = con.escape(info.class);
                    sql += `set class = ${info.class}`;
                }
                if(typeof info.tag === "string"){
                    info.tag = con.escape(info.tag);
                    if(sql == `update goods `){
                        sql += `set tag = ${info.tag}`;
                    }else{
                        sql += `,tag = ${info.tag}`;
                    };
                }
                if(typeof info.price === "number"){
                    info.price = con.escape(info.price);
                    if(sql == `update goods `){
                        sql += `set price = ${info.price}`;
                    }else{
                        sql += `,price = ${info.price}`;
                    };
                }
                if(typeof info.discount === "number"){
                    info.discount = con.escape(info.discount);
                    if(sql == `update goods `){
                        sql += `set discount = ${info.discount}`;
                    }else{
                        sql += `,discount = ${info.discount}`;
                    };
                }
                if(typeof info.name === "string"){
                    info.name = con.escape(info.name);
                    if(sql == `update goods `){
                        sql += `set name = ${info.name}`;
                    }else{
                        sql += `,name = ${info.name}`;
                    };
                }
                if(typeof info.rest === "number"){
                    info.rest = con.escape(info.rest);
                    if(sql == `update goods `){
                        sql += `set rest = ${info.rest}`;
                    }else{
                        sql += `,rest = ${info.rest}`;
                    };
                }
                sql += ` where id = ${info.id};`
                console.log(sql);
                con.query(sql,(err,result)=>{
                    if(err){
                        console.log(err);
                        let back = {status:1};
                        con.end();
                        reject(back);
                    }else{
                        let back = {status:0};
                        con.end();
                        resolve(back);
                    }
                });
            }
        })
    }

    getOrderByGood(goodId){
        return new Promise((resolve,reject)=>{
            if(typeof goodId !== "string"){
                reject({status:1});
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                goodId = con.escape(goodId);
                let sql = `select * from orders
                            where good=${goodId}`;
                con.query(sql,(err,result)=>{
                    if(err){
                        con.end();
                        reject({status:2});
                    }else{
                        con.end();
                        resolve({status:0,result:result});
                    }
                });
            }
        });
    }

    deleteGood(info){
        return new Promise((resolve,reject)=>{
            if(typeof info.goodId !== "string" || typeof info.seller !== "string"){
                reject({status:1});
            }else{
                this.getOrderByGood(info.goodId).then((back)=>{
                    if(back.result.length != 0){
                        reject({status:2});
                    }else{
                        let con = mysql.createConnection({
                            host:this.host,
                            user:this.user,
                            password:this.passwd,
                            database:this.database
                        });
                        info.goodId = con.escape(info.goodId);
                        info.seller = con.escape(info.seller);
                        let sql = `delete from goods
                            where id = ${info.goodId} and seller = ${info.seller}`;
                        con.query(sql,(err,result)=>{
                            if(err){
                                console.log(err);
                                con.end();
                                reject({status:3});
                            }else{
                                con.end();
                                resolve({status:0});
                            }
                        });
                    }
                }).catch((back)=>{
                    console.log(back);
                    reject({status:5});
                });
            }
        });
    }

    /**
     *
     * @param info
     * @returns {Promise}
     */
    addOrUpdateGood(info){
        return new Promise((resolve,reject)=>{
            if(typeof info.name !== 'string' ||typeof info.rest !== 'number' ||typeof info.price !== 'number'  ||typeof info.seller !== 'string'){
                // console.log("aaawewewe"+info);
                let back = {status:1};
                reject(back);
            }else{
                this.getUserInfoById(info.seller).then((back)=>{
                    if(back.result.type === 's'){
                        if(typeof info.id === "string"){
                            this.getGoodInfoById(info.id).then((back)=>{
                                if(back.result.length === 0){
                                    this.insertGood(info).then((back)=>{
                                        resolve(back);
                                    }).catch((back)=>{
                                        reject(back);
                                    });
                                }else{
                                    if(back.result[0].seller !== info.seller){
                                        reject({status:10});
                                    }else{
                                        this.updateGood(info).then((back)=>{
                                            resolve(back);
                                        }).catch((back)=>{
                                            reject(back);
                                        });
                                    }
                                }
                            }).catch((back)=>{
                                reject(back);
                            });
                        }else{
                            info.id = uuid.v1();
                            this.insertGood(info).then((back)=>{
                                resolve(back);
                            }).catch((back)=>{
                                reject(back);
                            });
                        }
                    }else{
                        reject({status:2});
                    }
                }).catch((back)=>{
                    reject(back);
                });
            }
        });
    }

    /**
     *
     * @param userId
     * @returns {Promise}
     */
    getGoodInfo(userId){
        return new Promise((resolve,reject)=>{
            if(typeof userId !== 'string'){
                let back = {status:1};
                reject(back);
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                userId = con.escape(userId);
                let sql = `select id goodId,name goodName,class goodClasses,tag goodTags,discount goodDiscount,rest goodRest,price goodPrice from goods
                            where seller = ${userId}`;
                con.query(sql,(err,result)=>{
                    if(err){
                        con.end();
                        let back = {status:2,errM:err.message};
                        reject(back);
                    }else{
                        con.end();
                        let back = {status:0,result:result};
                        resolve(back);
                    }
                })
            }
        });
    }


    /**
     *
     * @param goodId
     * @param seller
     * @returns {Promise}
     */
    checkGoodSeller(goodId,seller){
        return new Promise((resolve,reject)=>{
            this.getGoodInfoById(goodId).then((back)=>{
                if(back.status !== 0){
                    reject(back);
                }else{
                    if(back.result.length === 1 && back.result[0].seller === seller){
                        resolve({status:0});
                    }else{
                        reject({status:10});
                    }
                }
            }).catch((back)=>{
                reject(back);
            });
        });
    }

    getGood(info){
        return new Promise((resolve,reject)=>{
            if(typeof info.page !== "number"){
                reject({status:1});
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                let sql =  `select id,name,rest,saleVolume,price,seller,discount from goods `;
                if(typeof info.keyword === "string"){
                    let ery = `where name like "%${info.keyword}%" or tag like "%${info.keyword}%" `;
                    sql += ery;
                }
                sql += `limit ${info.page*100},100;`
                console.log(sql);
                con.query(sql,(err,result)=>{
                    if(err){
                        con.end();
                        console.log(err);
                        reject({status:2});
                    }else{
                        con.end();
                        console.log(result);
                        resolve({status:0,result:result});
                    }
                });
            }
        });
    }

    getOrderByUser(userId){
        return new Promise((resolve,reject)=>{
            if(typeof userId !== "string"){
                reject({status:1});
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                userId = con.escape(userId);
                let sql =  `select 
                            orders.id orderId,
                            orders.orderDate orderDate,
                            goods.name goodName,
                            orders.num orderNum,
                            orders.addr orderAddr,
                            orders.price orderPrice,
                            orders.message orderMessage,
                            orders.status orderStatus,
                            orders.price*orders.num orderMoney 
                            from orders,goods where (orders.buyer = ${userId} or orders.seller = ${userId}) and goods.id = orders.good;`;
                console.log(sql);
                con.query(sql,(err,result)=>{
                    if(err){
                        console.log(err);
                        con.end();
                        reject({status:2});
                    }else{
                        console.log(result);
                        con.end();
                        resolve({status:0,result:result});
                    }
                });
            }
        });
    }

    deleteOrder(userId,orderId){
        return new Promise((resolve,reject)=>{
            if(typeof orderId !== "string" || typeof userId !== "string"){
                reject({status:1});
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                orderId = con.escape(orderId);
                let sql = `select * from orders where id = ${orderId};`;
                con.query(sql,(err,result)=>{
                    if(err){
                        con.end();
                        reject({status:2});
                    }else{
                        if(result.length == 0){
                            con.end();
                            reject({status:3});
                        }else{
                            if(result[0].status === 'e' && (result[0].seller === userId || result[0].buyer === userId)){
                                console.log("bbb"+result);
                                if(result[0].seller == userId){
                                    let sql = `delete from orders where id = ${orderId};`;
                                    con.query(sql, (err, result) => {
                                        if (err) {
                                            con.end();
                                            reject({status: 6});
                                        } else {
                                            con.end();
                                            resolve({status: 0});
                                        }
                                    });
                                }else{
                                    console.log("aweee");
                                    con.end();
                                    reject({status:10});
                                }
                            }else{
                                console.log(result);
                                if(result[0].seller === userId && result[0].status !== 'g'){
                                    let num = result[0].num;
                                    let goodId = result[0].good;
                                    con.beginTransaction((err)=>{
                                        if(err){
                                            con.end();
                                            reject({status:4});
                                        }else{
                                            let sql = `update goods set rest = rest + ${num} where goods.id = '${goodId}';`;
                                            con.query(sql,(err,result)=>{
                                                if(err){
                                                    con.rollback();
                                                    con.end();
                                                    reject({status:5});
                                                }else{
                                                    let sql = `delete from orders where id = ${orderId};`;
                                                    con.query(sql,(err,result)=>{
                                                        if(err){
                                                            con.rollback();
                                                            con.end();
                                                            reject({status:6});
                                                        }else{
                                                            con.commit((err)=>{
                                                                if(err){
                                                                    con.rollback();
                                                                    con.end();
                                                                    reject({status:7});
                                                                }else{
                                                                    con.end();
                                                                    resolve({status:0});
                                                                }
                                                            });

                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }else{
                                    con.end();
                                    reject({status:10});
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    alterOrderstatus(userId,orderId,status){
        return new Promise((resolve,reject)=>{
            if(typeof orderId !== "string" || typeof status !== "string"){
                reject({status:1});
            }else{
                let con = mysql.createConnection({
                    host:this.host,
                    user:this.user,
                    password:this.passwd,
                    database:this.database
                });
                orderId = con.escape(orderId);
                let sql = `select * from orders where id = ${orderId};`;
                con.query(sql,(err,result)=>{
                    if(err){
                        con.end();
                        reject({status:3});
                    }else{
                        if(result.length == 0){
                            con.end();
                            reject({status:4});
                        }else{
                            if(result[0].seller === userId){
                                if(status !== 'o' && status !== 'g'){
                                    con.end();
                                    reject({status:1});
                                }else{
                                    let sql = `update orders set status = '${status}' where id = ${orderId};`;
                                    con.query(sql,(err,result)=>{
                                        con.end();
                                        if(err){
                                            reject({status:5});
                                        }else{
                                            resolve({status:0});
                                        }
                                    });
                                }
                            }else if(result[0].buyer === userId){
                                if(status !== 'e' &&  status !== 'c'){
                                    con.end();
                                    reject({status:1});
                                }else{
                                    if(result[0].status == 'g' && status == 'c'){
                                        con.end();
                                        reject({status:10});
                                    }else{
                                        let sql = `update orders set status = '${status}' where id = ${orderId};`;
                                        con.query(sql,(err,result)=>{
                                            con.end();
                                            if(err){
                                                reject({status:6});
                                            }else{
                                                resolve({status:0});
                                            }
                                        });
                                    }
                                }
                            }else{
                                con.end();
                                reject({status:7});
                            }
                        }
                    }
                });
            }
        });
    }
}

// console.log(uuid.v1());

// new Mysql("root","liutengying").addUser({email:"",phone:"13990073342",passwd:"liutengying",name:"刘腾营"})
//     .then((back)=>{
//         console.log(back);
//     })
//     .catch((back)=>{
//         console.log(back);
//     });

// new Mysql("root","liutengying").checkEmail("287233266@qq.com")
//     .then((back)=>{
//         console.log(back);
//     })
//     .catch((back)=>{
//         console.log(back);
//     });

// new Mysql("root","liutengying").checkPhone("15927168570")
//     .then((back)=>{
//         console.log(back);
//     })
//     .catch((back)=>{
//         console.log(back);
//     });

// new Mysql("root","liutengying").checkUser({user:"287233266@qq.com",passwd:"liutengying"})
//     .then((back)=>{
//         console.log(back);
//     })
//     .catch((back)=>{
//         console.log(back);
//     });

// new Mysql("root","liutengying").getUserInfoById("2562f140-44ff-11e7-a0b4-bd905294d74c")
//     .then((back)=>{
//         console.log(back);
//     })
//     .catch((back)=>{
//         console.log(back);
//     });

// new Mysql("root","liutengying").addOrUpdateGood({id:"994cb380-4b7f-11e7-aa9a-cf7eb7ac36c7",seller:"409514c0-499b-11e7-8b46-0fade443ec98",name:"大家伙",price:99.9,rest:20}).then((back)=>{
//     console.log(back);
// }).catch((back)=>{
//     console.log(back);
// });

// new Mysql("root","liutengying").getGoodInfo("409514c0-499b-11e7-8b46-0fade443ec98").then((back)=>{
//     console.log(back);
// }).catch((back)=>{
//     console.log(back);
// });


// new Mysql("root","liutengying").deleteGood({goodId:"994cb380-4b7f-11e7-aa9a-cf7eb7ac36c7"}).then((back)=>{
//     console.log(back);
// }).catch((back)=>{
//     console.log(back);
// });

// new Mysql("root","liutengying").getOrderByUser("409514c0-499b-11e7-8b46-0fade443ec98").then((back)=>{
//     console.log(back);
// }).catch((back)=>{
//     console.log(back);
// });

// new Mysql("root","liutengying").deleteOrder("409514c0-499b-11e7-8b46-0fade443ec98","2a544740-4e86-11e7-bcb2-db813ed95023").then((back)=>{
//     console.log(back);
// }).catch((back)=>{
//     console.log(back);
// });

// new Mysql("root","liutengying").getGood(0);

module.exports = Mysql;
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
        let con = mysql.createConnection({
            host:this.host,
            user:this.user,
            password:this.passwd,
            database:this.database
        });
        return new Promise((resolve,reject)=>{
            if(typeof info.email !== 'string' || typeof info.phone !== 'string' || typeof info.passwd !== 'string' || typeof info.name !== 'string'){
                console.log(info);
                let back = {status:1};
                reject(back);
            }else if(info.name === "" || info.phone === "" || info.passwd === "" || info.email === "" || info.sex === ""){
                let back = {status:1};
                reject(back);
            }else{
                info.email = con.escape(info.email);
                info.phone = con.escape(info.phone);
                info.passwd = con.escape(info.passwd);
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

                                    let sql = `insert into users(id,name,email,phone`;
                                    if(typeof info.sex === 'string'){
                                        info.sex = con.escape(info.sex);
                                        sql += `,sex) values('${id}',${info.name},${info.email},${info.phone},${info.sex});`;
                                    }else{
                                        sql +=`) values('${id}',${info.name},${info.email},${info.phone});`;
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
                                                            let back = {status:0};
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
        let con = mysql.createConnection({
            host:this.host,
            user:this.user,
            password:this.passwd,
            database:this.database
        });
        return new Promise((resolve,reject)=>{
            if(typeof email === 'undefined'){
                let back = {status:1};
                reject(back);
            }else{
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
        let con = mysql.createConnection({
            host:this.host,
            user:this.user,
            password:this.passwd,
            database:this.database
        });
        return new Promise((resolve,reject)=>{
            if(typeof phone === 'undefined'){
                let back = {status:1};
                reject(back);
            }else{
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

module.exports = Mysql;
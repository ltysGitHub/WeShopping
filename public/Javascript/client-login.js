/**
 * Created by 刘腾营 on 2017/5/31.
 */

function login(info){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../login/",
            data:info,
            success:(back)=>{
                console.log(back);
                if(back.status === 0){
                    resolve(back);
                }else{
                    console.log("wwwww");
                    reject(back);
                }
            }
        });
    });
}

function logout(){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../logout/",
            success:(back)=>{
                console.log(back);
                if(back.status === 0){
                    resolve(back);
                }else{
                    reject(back);
                }
            }
        });
    });
}
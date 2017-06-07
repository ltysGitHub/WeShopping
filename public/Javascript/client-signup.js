/**
 * Created by 刘腾营 on 2017/5/29.
 */

function checkPhone(phone){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../signup/check/phone?phone="+phone,
            data:{phone:phone},
            success:(back)=>{
                console.log(back);
                resolve(back);
            }
        });
    });
}


function signup(info){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../signup",
            data:info,
            success:(back)=>{
                console.log(back);
                if(back.status == 0){
                    resolve(back);
                }else{
                    reject(back);
                }
            }
        });
    });
}


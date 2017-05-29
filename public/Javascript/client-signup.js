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

function checkEmail(email){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../signup/check/email?email="+email,
            data:{email:email},
            success:(back)=>{
                console.log(back);
                resolve(back);
            }
        });
    });
}
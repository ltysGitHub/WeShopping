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
            url:"../signup/check/email",
            data:{email:email},
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
                resolve(back);
            }
        });
    });
}

function alert(info,msec,closeCover){
    $("#alert-content-lab").html(info);
    $("#alert").fadeIn(500);
    $("#div-cover-layer").fadeIn(500);
    setTimeout(()=>{
        $("#alert").fadeOut(500);
        if(closeCover){
            $("#div-cover-layer").fadeOut(500);
        }
    },msec);
}
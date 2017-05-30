/**
 * Created by 刘腾营 on 2017/5/23.
 */
// const signup = require('./client-signup');

$(document).ready(function(){
    $("#nav-head").click(function(){
        $("#div-login").fadeIn(500);
        let height = parseFloat($("body").css("height").slice(0,-2)) + 46;
        if(height > 768){
            $("#div-cover-layer").css("height",height+"px");
        }else{
            $("#div-cover-layer").css("height",768+"px");
        }
        $("#div-cover-layer").fadeIn(500);
        $("#main").addClass("disabled");
    });

    $("#login-cancel").click(function(){
        $("#div-login").fadeOut(500);
        $("#div-cover-layer").fadeOut(500);
    });

    $("#div-cover-layer").click(function(){
        $("#div-login").fadeOut(500);
        $("#div-signup").fadeOut(500);
        $("#alert").fadeOut(500);
        $("#div-cover-layer").fadeOut(500);
    });

    $("#login-signup").click(function(){
        $("#div-login").fadeOut(500);
        $("#div-signup").fadeIn(500);
    });

    $("#signup-cancel").click(function(){
        $("#div-signup").fadeOut(500);
        $("#div-cover-layer").fadeOut(500);
    });

    $("#signup-sex-man").click(function(){
        $("#signup-sex-man").addClass("active");
        $("#signup-sex-man").addClass("disabled");
        $("#signup-sex-women").removeClass("active");
        $("#signup-sex-women").removeClass("disabled");
    });

    $("#signup-email-input").blur(function(){
        let email = $(this).val();
        let reg = /\w+[@]{1}\w+[.]\w+/;
        if(email == "" || reg.test(email)){
            $("#signup-email").removeClass("has-error");
            $("#signup-email").removeClass("has-success");
            $("#signup-email-prompt-lab").html("");
            if(email != ""){
                checkEmail(email)
                    .then((back)=>{
                        if(back.status === 0){
                            if(back.result === true){
                                $("#signup-email").addClass("has-error");
                                $("#signup-email").removeClass("has-success");
                                $("#signup-email-prompt-lab").html("邮箱已注册");
                            }else{
                                $("#signup-email").removeClass("has-error");
                                $("#signup-email").addClass("has-success");
                                $("#signup-email-prompt-lab").html("邮箱可用");
                            }
                        }
                    });
            }
        }else{
            $("#signup-email").removeClass("has-success");
            $("#signup-email").addClass("has-error");
            $("#signup-email-prompt-lab").html("邮箱格式错误");
        }
    });

    $("#signup-email-input").focus(function(){
        $("#signup-email").removeClass("has-success");
        $("#signup-email").removeClass("has-error");
        $("#signup-email-prompt-lab").html("");
    });

    // $("#signup-name-input").blur(function(){
    //     let name = $(this).val();
    //
    //     if(name != ""){
    //         $("#signup-name").removeClass("has-error");
    //         $("#signup-name-prompt-lab").html("");
    //     }else{
    //         $("#signup-name").addClass("has-error");
    //         $("#signup-name-prompt-lab").html("姓名不能为空");
    //     }
    // });

    $("#signup-name-input").focus(function(){
        $("#signup-name").removeClass("has-error");
        $("#signup-name-prompt-lab").html("");
    });

    $("#signup-passwd-input").focus(function(){
        $("#signup-passwd").removeClass("has-error");
        $("#signup-passwd-prompt-lab").html("");
    });

    $("#signup-phone-input").blur(function(){
        let phone = $(this).val();
        let reg = /^(((13[0-9]{1})|159|153)+\d{8})$/;
        if(phone == "" ||  reg.test(phone)){
            $("#signup-phone").removeClass("has-error");
            $("#signup-phone").removeClass("has-success");
            $("#signup-phone-prompt-lab").html("");
            if(phone != ""){
                checkPhone(phone)
                    .then((back)=>{
                        if(back.status === 0){
                            if(back.result === true){
                                $("#signup-phone").addClass("has-error");
                                $("#signup-phone").removeClass("has-success");
                                $("#signup-phone-prompt-lab").html("手机号已注册");
                            }else{
                                $("#signup-phone").removeClass("has-error");
                                $("#signup-phone").addClass("has-success");
                                $("#signup-phone-prompt-lab").html("手机号可用");
                            }
                        }
                    });
            }
        }else{
            $("#signup-phone").addClass("has-error");
            $("#signup-email").removeClass("has-success");
            $("#signup-phone-prompt-lab").html("电话号码格式错误");

        }
    });
    $("#signup-phone-input").focus(function(){
        $("#signup-phone").removeClass("has-error");
        $("#signup-phone").removeClass("has-success");
        $("#signup-phone-prompt-lab").html("");
    });


    $("#signup-sex-women").click(function(){
        $("#signup-sex-man").removeClass("active");
        $("#signup-sex-women").addClass("active");
        $("#signup-sex-women").addClass("disabled");
        $("#signup-sex-man").removeClass("disabled");
    });

    $("#alert").click(()=>{
        $("#alert").fadeOut(500);
    });

    $("#signup-sign-up").click(()=>{
        let err = 0;
        let email = $("#signup-email-input").val();
        let phone = $("#signup-phone-input").val();
        let passwd = $("#signup-passwd-input").val();
        let name = $("#signup-name-input").val();
        if(email == ""){
            $("#signup-email").addClass("has-error");
            $("#signup-email-prompt-lab").html("邮箱不能为空");
            err = 1;
        }
        if(name == ""){
            $("#signup-name").addClass("has-error");
            $("#signup-name-prompt-lab").html("昵称不能为空");
            err = 1;
        }
        if(phone == ""){
            $("#signup-phone").addClass("has-error");
            $("#signup-phone-prompt-lab").html("电话号码不能为空");
            err = 1;
        }
        if(passwd == ""){
            $("#signup-passwd").addClass("has-error");
            $("#signup-passwd-prompt-lab").html("密码不能为空");
            err = 1;
        }
        if($("#signup-phone").hasClass("has-error") || $("#signup-email").hasClass("has-error")){
            err = 1;
        }
        if(err === 1){
            alert("还有错误信息",3000,false);
        }else{
            let sex = 'u';
            if($("#signup-sex-man").hasClass("active")){
                sex = 'm';
            }
            if($("#signup-sex-women").hasClass("active")){
                sex = 'w';
            }
            let info = {email:email,phone:phone,passwd:passwd,name:name,sex:sex};
            signup(info)
                .then((back)=>{
                    console.log(back);
                    $("#div-signup").fadeOut(500);
                    alert("注册成功",3000,true);
                })
                .catch((back)=>{
                    console.log(back);
                    $("#div-signup").fadeOut(500);
                    alert("注册失败",3000,true);
                });
        }

    });

});
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
            $("#signup-email-prompt-lab").html("");
            if(email != ""){
                checkEmail(email)
                    .then((back)=>{
                        if(back.status === 0){
                            if(back.result === true){
                                $("#signup-email").addClass("has-error");
                                $("#signup-email-prompt-lab").html("邮箱已存在");
                            }else{
                                $("#signup-email-prompt-lab").html("邮箱可用");
                            }
                        }
                    });
            }
        }else{
            $("#signup-email").addClass("has-error");
            $("#signup-email-prompt-lab").html("邮箱格式错误");
        }
    });

    $("#signup-email-input").focus(function(){
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

    $("#signup-phone-input").blur(function(){
        let phone = $(this).val();
        let reg = /^(((13[0-9]{1})|159|153)+\d{8})$/;
        if(phone == "" ||  reg.test(phone)){
            $("#signup-phone").removeClass("has-error");
            $("#signup-phone-prompt-lab").html("");
        }else{
            $("#signup-phone").addClass("has-error");
            $("#signup-phone-prompt-lab").html("电话号码格式错误");
        }
    });
    $("#signup-phone-input").focus(function(){
        $("#signup-phone").removeClass("has-error");
        $("#signup-phone-prompt-lab").html("");
    });


    $("#signup-sex-women").click(function(){
        $("#signup-sex-man").removeClass("active");
        $("#signup-sex-women").addClass("active");
        $("#signup-sex-women").addClass("disabled");
        $("#signup-sex-man").removeClass("disabled");
    });


});
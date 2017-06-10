/**
 * Created by 刘腾营 on 2017/5/23.
 */
// const signup = require('./client-signup');

$(document).ready(function(){
    $("#nav-head").click(unloggedHeadClick);
    $("#nav-head-logged").hover(loggedHeadClick);

    $("#login-cancel").click(function(){
        $("#div-login").fadeOut(500);
        $("#div-cover-layer").fadeOut(500);
    });

    $("#div-cover-layer").click(function(){
        $("#div-login").fadeOut(500);
        $("#div-signup").fadeOut(500);
        $("#alert").fadeOut(500);
        $("#div-user-center").fadeOut(500);
        $("#div-cover-layer").fadeOut(500);
        $('#picture-upload').fileinput('destroy');
        $('#div-picture-upload').fadeOut(500);
        hideGoods();
    });

    $("#login-signup-btn").click(function(){
        // console.log("aaasdwd");
        $("#div-login").fadeOut(500);
        $("#div-signup").fadeIn(500);
    });

    $("#signup-cancel").click(function(){
        $("#div-signup").fadeOut(500);
        $("#div-cover-layer").fadeOut(500);
    });

    $("#signup-user-type-seller").click(function(){
        $("#signup-user-type-seller").addClass("active");
        $("#signup-user-type-seller").addClass("disabled");
        $("#signup-user-type-origin").removeClass("active");
        $("#signup-user-type-origin").removeClass("disabled");
    });

    $("#signup-user-type-origin").click(function(){
        $("#signup-user-type-origin").addClass("active");
        $("#signup-user-type-origin").addClass("disabled");
        $("#signup-user-type-seller").removeClass("active");
        $("#signup-user-type-seller").removeClass("disabled");
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

    $("#alert").click(()=>{
        $("#alert").fadeOut(500);
    });

    $("#signup-signup-btn").click(()=>{
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
            alert("还有错误信息",1000,false);
        }else{
            let type = 'o';
            if($("#signup-user-type-seller").hasClass("active")){
                type = 's';
            }
            if($("#signup-sex-women").hasClass("active")){
                type = 'o';
            }
            let info = {email:email,phone:phone,passwd:passwd,name:name,type:type,sex:'u'};
            signup(info).then((back)=>{
                // console.log(back);
                $("#div-signup").fadeOut(500);
                alert("注册成功",1000,true);
                $("#nav-head").unbind("click");
                $("#nav-head").attr("id","nav-head-logged");
                $("#nav-head-logged").hover(loggedHeadClick);
                initUser();
            })
            .catch((back)=>{
                // console.log(back);
                // $("#div-signup").fadeOut(500);
                alert("注册失败",1000,true);
            });
        }
    });

    $("#login-login-btn").click(()=>{
        let err = 0;
        let user = $("#login-user-input").val();
        let passwd = $("#login-passwd-input").val();
        if(user == ""){
            err = 1;
            $("#login-user").addClass("has-error");
            $("#login-user-prompt-lab").html("账号不能为空");
        }
        if(passwd == ""){
            err = 1;
            $("#login-passwd").addClass("has-error");
            $("#login-passwd-prompt-lab").html("密码不能为空");
        }
        if(err === 0){
            login({user:user,passwd:passwd}).then((back)=>{
                if(back.status === 0){
                    if(back.result == true){
                        alert("登录成功",1000,true);
                        $("#div-login").fadeOut(500);
                        $("#nav-head").unbind("click");
                        $("#nav-head").attr("id","nav-head-logged");
                        $("#nav-head-logged").hover(loggedHeadClick);
                        initUser();
                    }else{
                        alert("账号或密码错误",1000,false);
                    }
                }else{
                    // console.log("aaaa");
                    console.log(back);
                    alert("登录异常,请稍后再试",1000,false);
                }
            }).catch((back)=>{
                console.log(back);
                alert("登录异常,请稍后再试",1000,false);
            });
        }
    });

    $("#login-user-input").focus(()=>{
        $("#login-user").removeClass("has-error");
        $("#login-user-prompt-lab").html("");
    });

    $("#login-passwd-input").focus(()=>{
        $("#login-passwd").removeClass("has-error");
        $("#login-passwd-prompt-lab").html("");
    });

    $(window).resize(()=>{
        // $("body").css("width",$(window).width());
        let width = parseInt(document.documentElement.clientWidth);
        // console.log(width);
        if(width > 1366){
            window.onscroll = function(){};
            $("#nav").css("left",(width-1366)/2.0 + "px");
            $("#div-user-option").css("left",(width-1366)/2.0+1266+ "px");
        }else{
            window.onscroll=function(){
                // console.log("aaassssddd");
                let sl=-Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);
                $('#nav').css("left",sl+'px');
                $('#div-user-option').css("left",sl+1266+'px');
            }
            $("#nav").css("left",0 + "px");
            $('#div-user-option').css("left",1266+'px');
        }
    });
    // $('#nav').scrollFixed({fixed:'left'});
    // loadUserHead("user-head");

    // $("body").css("width",$(window).width());
    let width = parseInt(document.documentElement.clientWidth);
    console.log(width);
    if(width > 1366){
        window.onscroll = function(){};
        $("#nav").css("left",(width-1366)/2.0 + "px");
        $("#div-user-option").css("left",(width-1366)/2.0+1266+ "px");
    }else{
        window.onscroll=function(){
            // console.log("aaassssddd");
            let sl=-Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);
            $('#nav').css("left",sl+'px');
            $('#div-user-option').css("left",sl+1266+'px');
        }
        $("#nav").css("left",0 + "px");
        $('#div-user-option').css("left",1266+'px');
    }

    $("#div-user-option").hover(()=>{},()=>{
        $("#div-user-option").fadeOut(500);
    });

    loadGood(0).then((back)=>{
        fillGoodList(back.result);
    }).catch((back)=>{
        alert("商品加载异常,请稍后刷新页面",3000,true);
    });

    $("#search-btn").click(()=>{
        let keyword = $("#search-input").val();
        clearGoodList();
        console.log(keyword);
        if(keyword == ""){
            console.log("aawewe"+keyword);
            loadGood(0).then((back)=>{
                fillGoodList(back.result);
            }).catch((back)=>{
                alert("商品加载异常,请稍后刷新页面",3000,true);
            });
        }else{
            loadGoodByKeyWord(0,keyword).then((back)=>{
                fillGoodList(back.result);
            }).catch((back)=>{
                alert("商品加载异常,请稍后刷新页面",3000,true);
            });
        }
    });

    initUser();
});


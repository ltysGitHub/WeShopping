/**
 * Created by 刘腾营 on 2017/5/31.
 */
//
// function loadUserHead(userHeadId){
//     // new Promise((resolve))
//     $.ajax({
//         type:"GET",
//         url:"../user/header",
//         success:(back)=>{
//             console.log(back);
//             if(back.status == 0){
//                 $("#user-head").attr('src',back.result);
//             }else{
//                 $("#user-head").attr('src',"/static/image/user.png");
//             }
//         }
//     });
// }

function alert(info,msec,closeCover){
    $("#alert-content-lab").html(info);
    $("#alert").fadeIn(300);
    $("#div-cover-layer").fadeIn(500);
    setTimeout(()=>{
        $("#alert").fadeOut(500);
        if(closeCover){
            $("#div-cover-layer").fadeOut(500);
        }
    },msec);
}
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

function showCoverLayer(){
    let height = parseFloat($("body").css("height").slice(0,-2)) + 46;
    if(height > 768){
        $("#div-cover-layer").css("height",height+"px");
    }else{
        $("#div-cover-layer").css("height",768+"px");
    }
    $("#div-cover-layer").fadeIn(500);
}

function alert(info,msec,closeCover){
    $("#alert-content-lab").html(info);
    $("#alert").fadeIn(300);
    showCoverLayer();
    setTimeout(()=>{
        $("#alert").fadeOut(500);
        if(closeCover){
            $("#div-cover-layer").fadeOut(500);
        }
    },msec);
}

function unloggedHeadClick(){
    $("#div-login").fadeIn(500);
    let height = parseFloat($("body").css("height").slice(0,-2)) + 46;
    if(height > 768){
        $("#div-cover-layer").css("height",height+"px");
    }else{
        $("#div-cover-layer").css("height",768+"px");
    }
    $("#div-cover-layer").fadeIn(500);
    $("#main").addClass("disabled");
}

function loggedHeadClick(){
    // console.log("abc");
    $("#div-user-option").fadeIn("500");

}

function showGoods(){

    $('#tb_departments').bootstrapTable({
        url: '/Editable/GetDepartment',     //请求后台的URL（*）
        method: 'get',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: oTableInit.queryParams,//传递参数（*）
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        onEditableSave: function (field, row, oldValue, $el) {
            $.ajax({
                type: "post",
                url: "/Editable/Edit",
                data: { strJson: JSON.stringify(row) },
                success: function (data, status) {
                    if (status == "success") {
                        alert("编辑成功");
                    }
                },
                error: function () {
                    alert("Error");
                },
                complete: function () {

                }

            });
        }
    });
}

function addTableRow(tableId,columns=7,conArr){
    let table = $("#"+tableId);
    let html = '<tr>';
    for(let i = 0;i < columns;i++){
        html += '<td>';
        if(conArr.length > i){
            html += conArr;
        }
        html += '</td>';
    }
    html += '</tr>';

}

function initUserCenter(info){
    $("#user-center-email-lab-con").html(info.email);
    $("#user-center-phone-lab-con").html(info.phone);
    $("#user-center-name-lab-con").html(info.name);
    if(info.sex === 'm'){
        $("#user-center-sex-man-btn").addClass("active");
        $("#user-center-sex-man-btn").addClass("disable");
    }
    if(info.sex === 'f'){
        $("#user-center-sex-woman-btn").addClass("active");
        $("#user-center-sex-woman-btn").addClass("disable");
    }
    if(info.type === 's'){
        $("#user-center-type-seller-btn").addClass("active");
        $("#user-center-submit-show-good-btn").remove("disabled");
        $("#user-center-submit-show-good-btn").click();
    }else{
        $("#user-center-type-origin-btn").addClass("active");
    }

}
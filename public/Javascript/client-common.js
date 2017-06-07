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
    $('#seller-good-table').bootstrapTable({
        url: "../../user/good",
        method: 'post',
        toolbar: '#seller-good-tool-bar',
        // clickToSelect: true,
        showColumns: true,
        showRefresh: true,
        search: true,
        // editable:true,
        strictSearch: false,
        selectItemName:'select',
        sortable: true,
        uniqueId:'goodId',
        // searchOnEnterKey:true,
        columns: [{
            field:'select',
            checkbox:true
        }, {
            field: 'goodId',
            visible:false,
            title: '商品id'
        }, {
            field: 'goodName',
            editable:true,
            title: '商品名称'
        }, {
            field: 'goodTags',
            editable:true,
            title: '商品标签',
            // editable: {
            //     type : 'select2',
            //     title : '列名',
            //     name : 'zpyq',
            //     emptytext : "--",
            //     placement : 'top',
            //     inputclass : 'input-large',
            //     select2 : {
            //         allowClear : true,
            //         multiple : true,//多选
            //         tokenSeparators : [",", " "],
            //         width : '150px'//设置宽
            //
            //     }
            // }
        }, {
            field: 'goodClasses',
            editable:true,
            title: '商品类别'
        }, {
            field: 'goodPrice',
            editable:{
                type:"number",
                tpl:'<input type="number" step="0.01" min="0">'
            },
            title: '商品原价'
        }, {
            field: 'goodDiscount',
            editable:{
                type:"number",
                tpl:'<input type="number" step="0.01" max="1.0" min="0">'
            },
            title: '商品折扣'
        }, {
            field: 'goodRest',
            editable:{
                type:"number",
                tpl:'<input type="number"  min="0">'
            },
            title: '剩余数量'
        }, {
            field: 'option',
            title: '操作',
            formatter: function(value, row, index){
                return [
                    '<a class="save" title="保存修改"><span class="span-hover glyphicon glyphicon-save"></span></a>',
                    '&nbsp',
                    '<a class="delete" title="删除货物"><span class="span-hover glyphicon glyphicon-remove"></span></a>'
                ].join('');
            },
            events:{
                'click .save': function(e, value, row, index) {
                    console.log("aawewewqqq");
                    // console.log(row);
                    console.log(typeof row.goodPrice);
                    if(typeof row.goodName === 'undefined' || row.goodName == ""){
                        alert("商品名不能为空",1000,false);
                    }else if(typeof row.goodPrice === 'undefined' || row.goodPrice == ""){
                        alert("商品价格不能为空",1000,false);
                    }else if(typeof row.goodRest === 'undefined'  || row.goodRest == ""){
                        alert("商品剩余量不能为空",1000,false);
                    }else{
                        if(typeof row.goodDiscount === "undefined" || row.goodDiscount == ""){
                            row.goodDiscount = "1.0";
                        }
                        // console.log(row.goodDiscount);
                        let info = {
                            id:row.goodId,
                            name:row.goodName,
                            price:parseFloat(row.goodPrice),
                            discount:parseFloat(row.goodDiscount),
                            class:row.goodClasses,
                            tag:row.goodTags,
                            rest:parseInt(row.goodRest)
                        }
                        console.log(info);
                        addOrUpdateGood(info).then((back)=>{
                            alert("保存成功",1000,false);
                        }).catch((back)=>{
                            alert("保存失败，请稍后再试",1000,false);
                        });
                    }
                },
                'click .delete': function(e, value, row, index) {
                    // console.log(row);
                    if(typeof row.goodId === 'undefined' || row.goodId == ""){
                        alert("删除异常，请刷新页面",1000,false);
                    }else{
                        deleteGood(row.goodId).then((back)=>{
                            alert("删除商品成功",1000,false);
                            $('#seller-good-table').bootstrapTable('removeByUniqueId',row.goodId);
                        }).catch((back)=>{
                            if(back.status === 2){
                                alert("此商品还有订单，不能删除",1000,false);
                            }else{
                                alert("删除异常，请稍后重试",1000,false);
                            }
                        })
                    }
                },
            }
        }],
        cache: false,
        // data: [{
        //     goodId: "",
        //     goodName: "",
        //     goodTags:"",
        //     goodClasses:"",
        //     goodPrice:"",
        //     goodDiscount:"",
        // }, {
        //     id: 2,
        //     name: 'Item 2',
        //     price: '$2'
        // }],
        onEditableSave:function (field, row, oldValue, $el) {
            // $.ajax({
            //     type: "post",
            //     url: "/Editable/Edit",
            //     data: { strJson: JSON.stringify(row) },
            //     success: function (data, status) {
            //         if(status == "success"){
            //             alert("编辑成功");
            //         }
            //     },
            //     error: function () {
            //         alert("Error");
            //     },
            //     complete: function () {
            //
            //     }
            //
            // });
            console.log(field);
            console.log(row);
            console.log(oldValue);
        }
    });
    $("#div-seller-good").fadeIn(500);
}
//
// function addTableRow(tableId,columns=7,conArr){
//     let table = $("#"+tableId);
//     let html = '<tr>';
//     for(let i = 0;i < columns;i++){
//         html += '<td>';
//         if(conArr.length > i){
//             html += conArr;
//         }
//         html += '</td>';
//     }
//     html += '</tr>';
//
// }

function createId(){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../user/createId",
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

function hideGoods(){
    $('#seller-good-table').bootstrapTable('destroy');
    $("#div-seller-good").fadeOut(500);
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
        // $("#user-center-submit-show-good-btn").click();
    }else{
        $("#user-center-type-origin-btn").addClass("active");
    }

}
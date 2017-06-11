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
    showCoverLayer();
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
                    '<a class="picture" title="商品图片"><span class="span-hover glyphicon glyphicon-picture"></span></a>',
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
                        });
                    }
                },
                'click .picture':function(e, value, row, index){
                    if(typeof row.goodId !== 'undefined' && row.goodId != ""){
                        $("#picture-upload").fileinput({
                            uploadUrl:"../../user/uploadGoodPic",
                            previewSettings:{
                                image: {width: "200px", height: "200px"}
                            },
                            // showClose:true,
                            resizeImage:true,
                            maxImageWidth: 240,
                            maxImageHeight: 500,
                            allowedFileTypes: ['image'],
                            allowedPreviewTypes: ['image'],
                            allowedFileExtensions:['png'],
                            maxFileCount:1,
                            showRemove:false,
                            validateInitialCount:true,
                            dropZoneTitle:"将图片拖动到此处",
                            uploadExtraData:{goodId:row.goodId}
                        });
                        $('#picture-upload').on('fileclear', function(event) {
                            console.log("fileclear");
                            $('#picture-upload').fileinput('destroy');
                            $('#div-picture-upload').fadeOut(500);
                        });
                        $("#div-picture-upload").fadeIn(500);
                    }
                }
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
    console.log("abc");
    $("#div-seller-good").fadeOut(500);
    $('#seller-good-table').bootstrapTable('destroy');
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

function initOrderConfirm(goodId,addr,message,num){
    getGoodInfoById(goodId).then((back)=>{
        if(back.result[0].rest < num){
            alert("商品剩余量不足，请重新下单",2000,false);
        }else{
            console.log("aasdd");
            $("#order-confirm-num-lab").html("购买数量:"+num);
            $("#order-confirm-addr-lab").html("收货地址:"+addr);
            $("#order-confirm-message-lab").html("买家留言:"+message);
            $("#order-confirm-money-lab").html("商品总额:"+num*back.result[0].price*back.result[0].discount);
            $("#order-confirm-confirm-btn").click(()=>{
                // console.log("aaaaa");
                // console.log({goodId:goodId,addr:addr,message:message,num:num});
                addOrder({goodId:goodId,addr:addr,message:message,num:num}).then((back)=>{
                    alert("购买成功",2000,true);
                    $("#div-order").fadeOut(500);
                    $("#div-order-confirm").fadeOut(500);
                    uninitOrderConfirm();
                    uninitorder();
                }).catch((back)=>{
                    // console.log(back);
                    alert("服务器异常，请稍后再试",2000,false);
                    $("#div-order-confirm").fadeOut(500);
                    uninitOrderConfirm();
                });
            });
            $("#order-confirm-cancel-btn").click(()=>{
                $("#div-order-confirm").fadeOut(500);
            });
            $("#div-order-confirm").fadeIn(500);
        }
    }).catch((back)=>{
        if(back.status == 13){
            alert("商品剩余量不足，请重新下单",2000,false);
        }else{
            alert("服务器异常，请稍后再试",2000,false);
        }
    });
}

function uninitOrderConfirm(){
    $("#order-confirm-num-lab").html("");
    $("#order-confirm-addr-lab").html("");
    $("#order-confirm-message-lab").html("");
    $("#order-confirm-money-lab").html("");
    $("#order-confirm-confirm-btn").unbind("click");
    $("#order-confirm-cancel-btn").unbind("click");
}

function initOrder(goodId){
    getUserInfo().then((back)=>{
        if(back.result.type != 'o'){
            alert("商家不能购买商品",2000,true);
        }else{
            $("#order-num-input").focus(()=>{
                $("#order-num").removeClass("has-error");
                $("#order-num-prompt-lab").html("");
            })
            $("#order-addr-input").focus(()=>{
                $("#order-addr").removeClass("has-error");
                $("#order-addr-prompt-lab").html("");
            })
            $("#order-create-btn").attr("goodid",goodId);
            $("#order-create-btn").click(function(){
                console.log("aaaaa");
                let error = 0;
                let message = $("#order-message-input").val();
                let num = $("#order-num-input").val();
                let addr = $.trim($("#order-addr-input").val());
                if(addr == ""){
                    error = 1;
                    $("#order-addr").addClass("has-error");
                    $("#order-addr-prompt-lab").html("收货地址不能为空");
                }
                if(typeof num !== "string" || num == "" || parseInt(num) <= 0){
                    error = 1;
                    console.log("bbb");
                    $("#order-num").addClass("has-error");
                    $("#order-num-prompt-lab").html("数量输入错误");
                }
                if(error === 0){
                    initOrderConfirm(goodId,addr,message,parseInt(num));
                }
            });
            $("#order-cancel-btn").click(function(){
                $("#div-cover-layer").fadeOut(500);
                $("#div-order").fadeOut(500);
                uninitorder();
            });
            $("#order-cancel").click(function(){
                $("#div-cover-layer").fadeOut(500);
                $("#div-order").fadeOut(500);
                uninitorder();
            });
            $("#div-cover-layer").fadeIn(500);
            $("#div-order").fadeIn(500);
        }
    }).catch((back)=>{
        if(back.status === 10){
            alert("请先登录",2000,true);
        }else{
            alert("服务器异常，请稍后再试",2000,true);
        }
    });
}

function uninitorder(){
    $("#order-message-input").val("");
    $("#order-addr-input").val("");
    $("#order-num-input").val("");
    $("#order-create-btn").attr("goodid","");
    $("#order-create-btn").unbind("click");
    $("#order-cancel-btn").unbind("click");
}

function fillGoodList(result){
    for(let good of result){
        let html = `<div class="good">
                <div class="good-photo">
                    <img src="static/goodPic/${good.id}/0.png" alt="暂无图片" class="good-img" id="img-src"/>
                </div>
                <div class="div-good-name">
                    <label class="good-name-lab">${good.name}</label>
                </div>
                <div class="div-good-price">
                    <label class="good-price-lab"><s>￥${good.price}</s>￥${good.price*good.discount}</label>
                </div>
                <div class="div-good-option">
                    <label class="good-shop-cart-btn btn btn-primary" goodId="${good.id}">加入购物车</label>
                    <label class="good-buy-btn btn btn-success" goodId="${good.id}">立即购买</label>
                </div>
            </div>`;
        $("#good-list").append(html);
    }
    $(".good-buy-btn").click(function(){
        let goodId = $(this).attr("goodid");
        initOrder(goodId);
        // console.log(goodId);
    });
    $("#good-list").fadeIn(100);
}

function clearGoodList(){
    $("#good-list").fadeOut(100);
    $("#good-list").html("");
}

function initGood(){
    loadGood(0).then((back)=>{
        fillGoodList(back.result);
    }).catch((back)=>{
        alert("商品加载异常,请稍后刷新页面",3000,true);
    });
}

function initOrderTable(ifSeller){
    if(!ifSeller){
        $("#order-table").bootstrapTable({
            url: "../../user/order",
            method: 'post',
            showColumns: true,
            showRefresh: true,
            search: true,
            strictSearch: false,
            sortable: true,
            uniqueId:'orderId',
            columns: [{
                field: 'orderId',
                visible:false,
                title: '订单id'
            }, {
                field: 'goodName',
                editable:false,
                title: '商品名称'
            }, {
                field: 'orderPrice',
                editable:false,
                title: '商品单价',
            }, {
                field: 'orderNum',
                editable:false,
                title: '商品数量',
            },{
                field: 'orderStatus',
                editable:false,
                title: '订单状态'
            }, {
                field: 'orderMessage',
                editable:false,
                title: '买家留言'
            }, {
                field: 'orderAddr',
                editable:false,
                title: '收货地址'
            }, {
                field: 'orderDate',
                editable:false,
                title: '订单时间'
            }, {
                field: 'orderMoney',
                editable:false,
                title: '订单总价'
            }, {
                field: 'option',
                title: '操作',
                formatter: function(value, row, index){
                    return [
                        '<a class="delete" title="取消订单"><span class="span-hover glyphicon glyphicon-remove"></span></a>',
                        '&nbsp',
                        '<a class="ok" title="确认收货"><span class="span-hover glyphicon glyphicon-ok"></span></a>'
                    ].join('');
                },
                events:{
                    'click .delete': function(e, value, row, index) {
                        alterOrder(row.orderId,'c').then((back)=>{
                            alert("取消订单成功",2000,false);
                            $('#order-table').bootstrapTable('removeByUniqueId',row.orderId);
                        }).catch((back)=>{
                            console.log(back);
                            if(back.status === 10){
                                alert("此状态的订单不可取消",2000,false);
                            }else{
                                alert("取消订单出错，请稍后再试",2000,false);
                            }

                        });
                        console.log(row);
                    },'click .ok': function(e, value, row, index) {
                        alterOrder(row.orderId,'e').then((back)=>{
                            alert("确认收货成功",2000,false);
                            $('#order-table').bootstrapTable('refresh');
                        }).catch((back)=>{
                            console.log(back);
                            alert("取消订单出错，请稍后再试",2000,false);
                        });
                        console.log(row);
                    }
                }
            }]
        });
    }else {
        $("#order-table").bootstrapTable({
            url: "../../user/order",
            method: 'post',
            showColumns: true,
            showRefresh: true,
            search: true,
            strictSearch: false,
            sortable: true,
            uniqueId: 'orderId',
            columns: [{
                field: 'orderId',
                visible: false,
                title: '订单id'
            }, {
                field: 'goodName',
                editable: false,
                title: '商品名称'
            }, {
                field: 'orderPrice',
                editable: false,
                title: '商品单价',
            }, {
                field: 'orderNum',
                editable: false,
                title: '商品数量',
            }, {
                field: 'orderStatus',
                editable: false,
                title: '订单状态'
            }, {
                field: 'orderMessage',
                editable: false,
                title: '买家留言'
            }, {
                field: 'orderAddr',
                editable: false,
                title: '收货地址'
            }, {
                field: 'orderDate',
                editable: false,
                title: '订单时间'
            }, {
                field: 'orderMoney',
                editable: false,
                title: '订单总价'
            }, {
                field: 'option',
                title: '操作',
                formatter: function (value, row, index) {
                    return [
                        '<a class="delete" title="取消订单"><span class="span-hover glyphicon glyphicon-remove"></span></a>',
                        '&nbsp',
                        '<a class="recive" title="接受订单"><span class="span-hover glyphicon glyphicon-ok"></span></a>',
                        '&nbsp',
                        '<a class="outgood" title="确认发货"><span class="span-hover glyphicon glyphicon-plane"></span></a>'
                    ].join('');
                },
                events: {
                    'click .delete': function (e, value, row, index) {
                        if(row.orderStatus === 'c' || row.orderStatus === 'e'){
                            deleteOrder(row.orderId).then((back)=>{
                                alert("删除订单成功",2000,false);
                                $('#order-table').bootstrapTable('removeByUniqueId',row.orderId);
                            }).catch((back)=>{
                                console.log(back);
                                if(back.status === 10){
                                    alert("此状态订单不能删除",2000,false);
                                }else{
                                    alert("删除失败，请稍后再试",2000,false);
                                }
                            });
                        }else{
                            alert("此状态订单不能删除",2000,false);
                        }
                        console.log(row);
                    },
                    'click .recive': function (e, value, row, index) {
                        if(row.orderStatus === 'u'){
                            alterOrder(row.orderId,'o').then((back)=>{
                                alert("接受订单成功",2000,false);
                                $('#order-table').bootstrapTable('refresh');
                            }).catch((back)=>{
                                console.log(back);
                                alert("接受订单出错，请稍后再试",2000,false);
                            });
                        }else{
                            alert("订单状态不正确",2000,false);
                        }
                    },
                    'click .outgood': function (e, value, row, index) {
                        console.log(row);
                        if(row.orderStatus === 'o' ){
                            alterOrder(row.orderId,'g').then((back)=>{
                                alert("发货成功",2000,false);
                                $('#order-table').bootstrapTable('refresh');
                            }).catch((back)=>{
                                console.log(back);
                                alert("发货出错，请稍后再试",2000,false);
                            });
                        }else{
                            alert("订单状态不正确",2000,false);
                        }
                    }
                }
            }]
        });
    }
    $("#order-table-cancel").click(()=>{
        uninitOrderTable();
        hideOrder();
        $("#div-order-table").fadeOut(500);
        $("#div-cover-layer").fadeOut(500);
    });
    $("#div-order-table").fadeIn(500);
}

function uninitOrderTable(){
    $("#order-table").bootstrapTable("destroy");
}

function hideOrder(){
    uninitOrderTable();
    $('#order-table').bootstrapTable('destroy');
    $("#div-order-table").fadeOut(500);
}


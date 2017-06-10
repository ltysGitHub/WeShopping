/**
 * Created by 刘腾营 on 2017/6/5.
 */

function getUserInfo(){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../user/info",
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

function addOrUpdateGood(info){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../user/addOrUpdateGood",
            data:info,
            success:(back)=>{
                if(back.status === 0){
                    resolve(back);
                }else{
                    reject(back);
                }
            }
        });
    });
}

function deleteGood(goodId){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../user/deleteGood",
            data:{goodId:goodId},
            success:(back)=>{
                if(back.status === 0){
                    resolve(back);
                }else{
                    reject(back);
                }
            }
        });
    });
}

function loadGood(page){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../user/loadGood",
            date:{page:page},
            success:(back)=>{
                if(back.status === 0){
                    resolve(back);
                }else{
                    reject(back);
                }
            }
        });
    });
}

function loadGoodByKeyWord(page,keyword){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"POST",
            url:"../user/loadGood",
            data:{page:page,keyword:keyword},
            success:(back)=>{
                if(back.status === 0){
                    resolve(back);
                }else{
                    reject(back);
                }
            }
        });
    });
}

function uninituser(){
    $("#user-option-quit").unbind("click");

    $("#user-option-center").unbind("click");

    $("#user-center-submit-show-good-btn").unbind("click");

    $("#user-center-submit-show-good-btn").addClass("disabled");

    $("#seller-good-cancel").unbind("click");

    $("#seller-good-add-btn").unbind("click");

    $("#seller-good-delete-btn").unbind("click");

}

function initUser(){
    getUserInfo().then((back)=>{
        $("#user-option-quit").click(()=>{
            logout().then((back)=>{
                $("#nav-head-logged").unbind("mouseenter").unbind("mouseleave");
                $("#nav-head-logged").attr("id","nav-head");
                $("#nav-head").click(unloggedHeadClick);
                $("#div-user-option").fadeOut(100);
                uninituser();
                alert("退出登录成功",1000,true);
            }).catch((back)=>{
                alert("退出登录异常，请稍后再试",1000,true);
            });
        });
        $("#user-option-center").click(()=>{
            // $("#div-cover-layer").fadeIn(500);
            initUserCenter(back.result);
            showCoverLayer();
            $("#div-user-center").fadeIn(500);
            // console.log("aaaa");
        });
        if(back.result.type === 's'){
            $("#user-center-submit-show-good-btn").removeClass("disabled");
            $("#user-center-submit-show-good-btn").click(()=>{
                $("#div-user-center").fadeOut(500);
                showGoods();
            });

            $("#seller-good-cancel").click(()=>{
                // console.log("aaa");
                $('#picture-upload').fileinput('destroy');
                $('#div-picture-upload').fadeOut(500);
                $("#div-cover-layer").fadeOut(500);
                hideGoods();
            });

            $("#seller-good-add-btn").click(()=>{
                createId().then((back)=>{
                    $('#seller-good-table').bootstrapTable('prepend',{goodId:back.result,goodName:"",goodPrice:"0",goodDiscount:"1.0",goodTags:"",goodClasses:"",goodRest:"0"});
                }).catch((back)=>{
                    console.log(back);
                    alert("异常操作,请稍后重试",1000,false);
                });
            });

            $("#seller-good-delete-btn").click(()=>{
                let selects = $('#seller-good-table').bootstrapTable('getSelections');
                // console.log(JSON.stringify(selects));
                for(let select of selects){

                    // console.log(select);
                    $('#seller-good-table').bootstrapTable('removeByUniqueId',select.goodId);
                }
            });
        }
    }).catch((back)=>{
        $("#user-option-quit").unbind("click");

        $("#user-option-center").unbind("click");

        $("#user-center-submit-show-good-btn").unbind("click");

        $("#user-center-submit-show-good-btn").addClass("disabled");

        $("#seller-good-cancel").unbind("click");

        $("#seller-good-add-btn").unbind("click");

        $("#seller-good-delete-btn").unbind("click");
        // alert("系统错误，请刷新页面",3000,true);
    })
}
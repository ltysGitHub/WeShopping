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


var $;
var layer;
layui.use(['form', 'layedit', 'laydate','layer'], function() {
    var form = layui.form
        , layedit = layui.layedit
        , laydate = layui.laydate;

    $ = layui.$;
    layer = layui.layer;


});



function closeiframe() {

    layui.use('form',function () {
        var form = layui.form;

        // 关闭
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭

    });

}



// 初始化编辑界面
function init() {
    layui.use(['form','jquery'],function () {
        var form = layui.form;
        var $ = layui.$;

        // 从layui.data 上拿到 admin 信息
        var admin = layui.data("user").admin;

        // 拼接  拼接不能修改的account
        $("#self-account").val(admin.userName);

    });

}

// 提交修改
function formSubmit() {

    // 修改前校验:
    var oldPwd = $("#self-old-password").val();
    var newPwd = $("#self-new-password").val();
    var repeat = $("#self-new-repeat-password").val();

    // 密码是否为空
    if (oldPwd == null || oldPwd == ''){
        layer.msg("请输入旧密码");
    }
    else if (newPwd == null || newPwd == ''){
        layer.msg("请输入新密码");
    }
    else if (repeat == null || repeat == ''){
        layer.msg("请再次输入新密码");
    }else{

        // 检验两次的正确性

        if (repeat != newPwd){
            layer.msg("两次输入的密码不一致!");
        }else{
            // 发送请求

            var result = submitUpdate(layui.data("user").admin.id,oldPwd,newPwd);

            if (result == true){

                // 修改成功 关闭当前layer

                layer.open({
                    type: 0,
                    content: '修改成功，即将注销重新登录', //这里content是一个普通的String
                    time: 2000,
                    end:function () {
                        // 结束后 关闭当前弹窗 在data 中写入成功修改

                        layui.data("user",{
                            key:'updateTag',
                            value:true
                        });

                        closeiframe();

                        // 跳转到登录
                    }
                });


                // 关闭当前

            }else{
                layui.data("user",{
                    key:'updateTag',
                    value:false
                });
                layer.msg(result);
            }

        }

    }





}

function submitUpdate(id,oldPwd,newPwd) {

    var result;

    $.ajax({
        type:"post",
        async:false,
        url:"http://localhost:8084/api/uc/useradmin/update-pwd",
        data: {
            id:id,
            oldPwd:oldPwd,
            newPwd:newPwd
        },
        success:function (data,status) {
            if (data.success == true){
                result = true;
            }else{
                result = data.message;
            }
        }
    });

    return result;
}


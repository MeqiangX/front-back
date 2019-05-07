

layui.use(['form', 'layedit', 'laydate'], function() {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate;


});


// 初始化查看界面
function init() {
    layui.use(['form','jquery'],function () {
        var form = layui.form;
        var $ = layui.$;

        // 从layui.data 上拿到 admin 信息
        var admin = layui.data("user").admin;

        // 拼接
        $("#account").val(admin.userName);
        $("#password").val(admin.userPassword);

    });

}

var isPs = true;
function qiehuan(){

    var Input = document.getElementById('password');
    if(isPs){
        Input.setAttribute("type","password");
        document.getElementById('btn').innerText = "显示";
        isPs = false;
    }else{
        Input.setAttribute("type","text");
        document.getElementById('btn').innerText = "隐藏";
        isPs = true;
    }


}

// 修改密码 弹框
function updatePwd() {
    //  查看操作
    layer.open({
        type: 2,
        area: ['800px', '600px'],
        content: 'self_edit.html', //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
        end:function () {
            var updateTag = layui.data("user").updateTag;

            console.log("updateTag --- " + updateTag);

            //清除
            layui.data('user', {
                key: 'updateTag'
                ,remove: true
            });

            if (updateTag){
                // 修改成功 ---> 跳转登录
                window.parent.location.href = "login.html";
            }
        }
    });
}


var $;
var layer;
layui.use(['form', 'layedit', 'laydate','layer'], function() {
    var form = layui.form
        , layedit = layui.layedit
        , laydate = layui.laydate;

    $ = layui.$;
    layer = layui.layer;


    // 设置验证
    form.verify({
        username: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,pass: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
            ,'密码至少包含大写字母，小写字母，数字，且不少于8位'
        ]
    });

    form.on('submit(*)', function(data){
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

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

        // 从uri中拿到id
        var url = document.location.toString();
        var arrUrl = url.split("?");

        var para = arrUrl[1];
        var id = (para.split("="))[1];
        console.log(url);
        // (para.split("="))[0]
        console.log("参数名：" + (para.split("="))[0]);
        if ("id" != (para.split("="))[0]){
            // 当前参数不是id 不是编辑操作 是新增 直接return
            return ;
        }

        // 查询信息
        var result;
        $.ajax({
            type:"get",
            async:false,
            url:"http://localhost:8084/api/uc/user/user-by-id",
            data:{
                id:id
            },
            success:function (data,status) {
                result = data.data;
            }
        });

        // 拼接
        $("#user-id").val(result.id);
        $("#user-name").val(result.userName);
        $("#user-password").val(result.userPassword);
        $("#user-phone").val(result.phone);
        $("#user-email").val(result.email);

        $.each($("input[name='status']") ,function (index, data) {//index是索引,从0开始

            if( data.value == result.status) {
                console.log(data.value);
                $(data).prop('checked',true);//data表示数据的内容,比如男女
            }
        });

        form.render();

    });


}

// 提交修改
function formSubmit() {

    // 修改前校验:

    // 手机号 邮箱 密码 格式
    var emailReg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/; // 邮箱
    var pwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
    var phoneReg = /^1[34578]\d{9}$/;
    var email = $("#user-email").val();
    var phone = $("#user-phone").val();
    var pwd = $("#user-password").val();

    var emailResult = true;
    var pwdResult = true;
    var phoneResult = true;

    if (email != null && email != ''){
        emailResult = emailReg.test(email);
    }
    if (phone != null && phone != ''){
        phoneResult = phoneReg.test(phone);
    }
    if (pwd != null && pwd != ''){
        pwdResult = pwdReg.test(pwd);
    }


    if (emailResult && phoneResult && pwdResult){
        var result = submitUpdate();
        var userId = $("#user-id").val();
        console.log("id ; "+userId);
        if (userId == undefined || userId == null || userId == ''){
            // 添加
            if (true == result){
                layer.msg("添加成功！");
            }else{
                layer.msg(result);
            }
        }else{
            // 修改
            if (result == true){
                // 关闭当前弹窗
                closeiframe();
                // 刷新页面
            }else{
                // 弹出层
                layer.alert(result);
            }
        }
    }else{
        if (!emailResult){
            layer.msg("请输入正确的邮箱！");
        }else if (!phoneResult){
            layer.msg("请输入正确的11位手机号码！");
        }else{
            layer.msg("密码至少包含大写字母，小写字母，数字，且不少于8位！");
        }
    }





}

function submitUpdate() {


    var userAddPo = new Object();

    userAddPo.id=$("#user-id").val();
    console.log("id --> " + userAddPo.id);
    userAddPo.userName=$("#user-name").val();
    userAddPo.userPassword=$("#user-password").val();
    userAddPo.email=$("#user-email").val();
    userAddPo.phone=$("#user-phone").val();
    //$('#user-status input[name="status"]:checked ').val()//获取选中的值

    userAddPo.status=$('#user-status input[name="status"]:checked ').val();

    var result;

    $.ajax({
        type:"post",
        async:false,
        url:"http://localhost:8084/api/uc/useradmin/add-update-user",
        dataType:"json",
        contentType:"application/json",
        data: JSON.stringify(userAddPo),
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
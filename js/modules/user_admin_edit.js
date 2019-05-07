

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
            url:"http://localhost:8084/api/uc/useradmin/admin-by-id",
            data:{
                id:id
            },
            success:function (data,status) {
                result = data.data;
            }
        });

        // 拼接
        $("#user-admin-id").val(result.id);
        $("#user-admin-name").val(result.userName);
        $("#user-admin-password").val(result.userPassword);


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


        var result = submitUpdate();
        var userAdminId = $("#user-admin-id").val();
        console.log("id ; "+userAdminId);
        if (userAdminId == undefined || userAdminId == null || userAdminId == ''){
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






}

function submitUpdate() {


    var userAdminAddPo = new Object();

    userAdminAddPo.id=$("#user-admin-id").val();
    console.log("id --> " + userAdminAddPo.id);
    userAdminAddPo.userName=$("#user-admin-name").val();
    userAdminAddPo.userPassword=$("#user-admin-password").val();
    userAdminAddPo.parent = layui.data("user").admin.id;

    //$('#user-status input[name="status"]:checked ').val()//获取选中的值

    userAdminAddPo.status=$('#user-status input[name="status"]:checked ').val();

    var result;

    $.ajax({
        type:"post",
        async:false,
        url:"http://localhost:8084/api/uc/useradmin/add-update-admin",
        dataType:"json",
        contentType:"application/json",
        data: JSON.stringify(userAdminAddPo),
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
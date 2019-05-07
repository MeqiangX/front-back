

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

        // 从uri中拿到id
        var url = document.location.toString();
        var arrUrl = url.split("?");

        var para = arrUrl[1];
        var id = (para.split("="))[1];


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
        $("#user-admin-name").val(result.userName);
        $("#user-admin-password").val(result.userPassword);
        $("#user-admin-status").val(0 == result.status ? "正常" : "冻结");
    });


}
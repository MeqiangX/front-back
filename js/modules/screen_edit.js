

var $;
layui.use(['jquery','form', 'layedit', 'laydate'], function() {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate;

    $ = layui.$;
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

        if ((para.split("="))[0] != "id"){
            return ;
        }

        // 查询信息
        var result;
        $.ajax({
            type:"get",
            async:false,
            url:"http://localhost:8080/api/backend/screen/query-screen-by-id",
            data:{
                id:id
            },
            success:function (data,status) {
                result = data.data;
            }
        });


        // 拼接
        $("#screen-id").val(result.id);
        $("#screen-name").val(result.screeningHallName);
        $("#screen-x").val(result.screeningHallX);
        $("#screen-y").val(result.screeningHallY);

    });


}

function closeiframe() {

    layui.use('form',function () {
        var form = layui.form;

        // 关闭
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭

    });

}


// 提交修改
function formSubmit() {

    var result = submitUpdate();
    var screenId = $("#screen-id").val();
    console.log("id ; "+screenId);
    if (screenId == undefined || screenId == null || screenId == ''){
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

    var screenRoomAddPo = new Object();

    screenRoomAddPo.id=$("#screen-id").val();
    screenRoomAddPo.screeningHallName=$("#screen-name").val();
    screenRoomAddPo.screeningHallX=$("#screen-x").val();
    screenRoomAddPo.screeningHallY=$("#screen-y").val();


    var result;

    $.ajax({
        type:"post",
        async:false,
        url:"http://localhost:8080/api/backend/screen/add-screen-room",
        dataType:"json",
        contentType:"application/json",
        data: JSON.stringify(screenRoomAddPo),
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
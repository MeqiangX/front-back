

// 排片详情 js

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
            url:"http://localhost:8080/api/backend/cinema/arrange-records-by-id",
            data:{
                id:id
            },
            success:function (data,status) {
                result = data.data;
            }
        });


        // 拼接
        $("#cinema-name").val(result.cinemaName);
        $("#screen-name").val(result.screeningHallName);
        $("#movie-name").val(result.movieName);
        $("#date").val(result.arrangeDate);
        $("#start-time").val(result.timeScopeStart);
        $("#price").val(result.price);
        $("#language").val(result.language);
        $("#create-time").val(result.createTime);
        $("#update-time").val(result.updateTime);
    });


}
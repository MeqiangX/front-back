

// 订单详情 js

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
            url:"http://localhost:8082/api/portal/order/order-detail/" + id,
            success:function (data,status) {
                result = data.data;
            }
        });

        console.log(result);
        // 拼接
        $("#order-id").val(result.orderId);
        $("#user-id").val(result.userId);
        $("#movie-name").val(result.movieName);
        $("#cinema-name").val(result.cinemaName);
        $("#screen-name").val(result.screeningHallName);
        $("#start-time").val(result.timeScopeStart);
        $("#price").val(result.price);
        $("#status").val(0 == result.status ? "未支付" : "已支付");
        $("#seats").val(result.seats);
        $("#create-time").val(result.createTime);
    });


}
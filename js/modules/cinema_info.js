

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
            url:"http://localhost:8080/api/backend/cinema/search-cinema-by-id",
            data:{
                cinemaId:id
            },
            success:function (data,status) {
                result = data.data;
            }
        });


        // 拼接
        $("#cinema-name").val(result.cinemaName);
        $("#cinema-phone").val(result.phone);


        // 拿到上面两极
        var areas;
        $.ajax({
            type:"get",
            async:false,
            url:"http://localhost:8081/api/common/get-area-city-prov",
            data:{
                areaId:result.cinemaAreaId
            },
            success:function (data,status) {
                areas = data.data;
            }
        });


        $("#province").append("<option value=\""+ areas.province.provinceId +"\">"+ areas.province.province +"</option>");
        $("#city").append("<option value=\""+ areas.city.cityId +"\">"+ areas.city.city +"</option>");
        $("#area").append("<option value=\""+ areas.area.areaId +"\">"+ areas.area.area +"</option>");

        $("#cinema-addr").val(result.cinemaFullAddress);
        $("#cinema-image").attr("src",result.image);

        // 渲染form
        form.render('select'); // 动态加载的数据 要经过重新渲染 才能生效

    });


}
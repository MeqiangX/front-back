

var $;
var layer;
layui.use(['form', 'layedit', 'laydate','layer'], function() {
    var form = layui.form
        , layedit = layui.layedit
        , laydate = layui.laydate;

    layer = layui.layer;


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


// 图片上传
layui.use(['upload','jquery'],function () {

    $ = layui.$;
    var upload = layui.upload;

    //创建一个上传组件
    upload.render({
        elem: '#img-upload'
        ,url: 'http://localhost:8081/api/common/file/file-upload',
        data:{
            id:$("#cinema-id").val()
        },
        accept: "images"
        ,done: function(res, index, upload){ //上传后的回调
            // 将图片src 修改  res 为回调返回
            if (true === res.success){
                $("#cinema-image").attr("src",res.data);
            }
        }
        //,accept: 'file' //允许上传的文件类型
        //,size: 50 //最大允许上传的文件大小
        //,……
    })


});

// 初始化编辑界面
function init() {
    layui.use(['form','jquery'],function () {
        var form = layui.form;
        var $ = layui.$;


        // 初始化三级联动下拉框
        // 初始化 省份信息
        var province = provinceData();

        console.log(province);
        putSelectData('province','province',province);

        form.render('select', 'province'); // 动态加载的数据 要经过重新渲染 才能生效

        // 监听 省份select
        form.on('select(province-select)', function(data){
            console.log(data.value); //得到被选中的值

            // 将省份id 传入 城市select 初始化
            var citys = cityData(data.value);

            putSelectData('city','city',citys);


            form.render('select', 'city'); // 动态加载的数据 要经过重新渲染 才能生效

        });

        form.on('select(city-select)',function (data) {

            // 监听 城市select

            var areas = areaData(data.value);

            putSelectData('area','area',areas);


            form.render('select', 'area'); // 动态加载的数据 要经过重新渲染 才能生效

        });



        // 从uri中拿到id
        var url = document.location.toString();
        var arrUrl = url.split("?");

        var para = arrUrl[1];
        var id = (para.split("="))[1];

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
            url:"http://localhost:8080/api/backend/cinema/search-cinema-by-id",
            data:{
                cinemaId:id
            },
            success:function (data,status) {
                result = data.data;
            }
        });


        // 拼接
        $("#cinema-id").val(result.id);
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


        $("#province").val(areas.province.provinceId);
        $("#city").append("<option value=\""+ areas.city.cityId +"\">"+ areas.city.city +"</option>");
        $("#area").append("<option value=\""+ areas.area.areaId +"\">"+ areas.area.area +"</option>");


        $("#cinema-addr").val(result.cinemaFullAddress);
        $("#cinema-image").attr("src",result.image);


        // 渲染form
        form.render('select'); // 动态加载的数据 要经过重新渲染 才能生效
    });


}

// 提交修改
function formSubmit() {

    var result = submitUpdate();
    var cinemaId = $("#cinema-id").val();
    console.log("id ; "+cinemaId);
    if (cinemaId == undefined || cinemaId == null || cinemaId == ''){
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


    var cinemaAddPo = new Object();

    cinemaAddPo.id=$("#cinema-id").val();
    cinemaAddPo.cinemaName=$("#cinema-name").val();
    cinemaAddPo.phone=$("#cinema-phone").val();
    cinemaAddPo.areaId=$("#area").val();
    cinemaAddPo.cinemaFullAddress=$("#cinema-addr").val();
    cinemaAddPo.image=$("#cinema-image").attr("src");

    var result;

    $.ajax({
        type:"post",
        async:false,
        url:"http://localhost:8080/api/backend/cinema/cinema-add",
        dataType:"json",
        contentType:"application/json",
        data: JSON.stringify(cinemaAddPo),
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
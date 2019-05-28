

// 电影详情 js
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

        console
            .log("id = " +id);

        // 查询信息
        var result;
        $.ajax({
            type:"get",
            async:false,
            url:"http://localhost:8082/api/portal/movie/movie-details/" + id,
            success:function (data,status) {
                result = data.data;
                console
                    .log("result :" + result);

            }
        });

        console.log(result);
        // 拼接
        $("#movie-id").val(result.movieId);
        $("#movie-name").val(result.movieName);
        $("#movie-ori-name").val(result.originalName);
        $("#movie-image").attr("src",result.image);
        $("#genres").val(result.genres);
        $("#rating").val(result.rating);
        $("#ratings-count").val(result.ratingsCount);

        // 拼接导演， 演员 编剧 列表
        var directorList = result.directorList;
        var directorArray = new Array();

        for (var i = 0;i < directorList.length;++i){
            directorArray.push(directorList[i].directorName);
        }
        var directorNames = directorArray.join(",");


        // 演员
        var castList = result.castList;
        var castArray = new Array();

        for (var i = 0;i < castList.length;++i){
            castArray.push(castList[i].actorName);
        }
        var castNames = castArray.join(",");



        // 编剧
        var writerList = result.writerList;
        var writerArray = new Array();

        for (var i = 0;i < writerList.length;++i){
            writerArray.push(writerList[i].writerName);
        }
        var writerNames = writerArray.join(",");


        $("#directors").val(directorNames);
        $("#casts").val(castNames);
        $("#writers").val(writerNames);
        $("#year").val(result.year);
        $("#countries").val(result.countries);
        $("#summary").text(result.summary);
        $("#anotherName").val(result.anotherName);
        $("#pubdates").val(result.pubdates);
        $("#languages").val(result.languages);
        $("#tags").val(result.tags);
        $("#duration").val(result.duration);
    });


}
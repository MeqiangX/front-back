

//  排片编辑 js

var table;
var form;
var layer;
var $;
var tableObj;
var laydate;
var arrangeDateTime;
var movieId;



function init(){
    layui.use(['jquery','table','form','laydate'],function () {
        table = layui.table;
        form = layui.form;
        laydate = layui.laydate;
        $ = layui.$ //重点处
        //第一个实例
        // 搜索按钮绑定事件
        // 初始化表格

        // 先异步取得数据 当前id 的 相关信息

        // 从路径中获取id;
        // 从uri中拿到id
        var url = document.location.toString();
        var arrUrl = url.split("?");

        var para = arrUrl[1];
        var id = (para.split("="))[1];

        console.log(url);

        var arrangeInfo = getArrangeInfoById(id);
        arrangeDateTime = arrangeInfo.timeScopeStart;


        // 填充页面信息
        console
            .log(arrangeInfo);

        $("#arrange-id").val(id);
        $("#cinema").val(arrangeInfo.cinemaName);
        $("#screen").val(arrangeInfo.screeningHallName);
        $("#price").val(arrangeInfo.price);
        movieId = arrangeInfo.movieId;

        var options = {
            elem: '#movie-table'
            ,width: 1400
            ,url: 'http://localhost:8082/api/portal/movie/search-movies'//数据接口
            ,method:'get'
            , request:{
                pageName:'current', // 页码的重新命名
                limitName:'size' // 页容的命名
            },
            parseData:function (res) {
                // 返回格式的预解析

                //  设置为选中
                var records = res.data.records;
                for (var i = 0;i < records.length;++i){

                    if (records[i].movieId == arrangeInfo.movieId){
                        res.data.records[i].LAY_CHECKED='true';
                        break;
                    }
                }

                return {
                    "code":res.success == true ? 0 : 400,
                    "msg":res.data.message,
                    "count": res.data.total,
                    "data":res.data.records
                }
            }
            /*,where:{
                areaId:'',
                search:''
            }*/
            ,page: true //开启分页
            ,cols: [[ //表头
                {type: 'radio', title: '选择'}
                ,{field: 'movieId', title: 'movieId',width:100,sort: true,align:'center'}
                /*  ,{field: 'image', align:'center',title: '图片', width: 135,height:40,templet:'<div><img src="{{ d.image}}"></div>',style:'height:48px;width:48px;line-height:48px!important;'}*/
                ,{field: 'movieName', align:'center',title: '电影名', width:150}
                ,{field: 'originalName', align:'center',title: '原名', width: 180}
                ,{field: 'genres', align:'center',title: '类别', width:80, sort: true}
                ,{field: 'rating', align:'center',title: '评分', width:180}
                ,{field: 'ratingsCount', align:'center',title: '评分人数', width: 220}
                ,{field: 'year', title: '上映年份', width: 200, sort: true,align:'center'}
                ,{field: 'countries', title: '上映国家', width: 200, sort: true,align:'center'}
                ,{field: 'pubdates', title: '上映时间', width: 200, sort: true,align:'center'}
                ,{field: 'languages', title: '语言', width: 200, sort: true,align:'center'}
                ,{field: 'tags', title: '标签', width: 200, sort: true,align:'center'}
            ]]
        };

        tableObj = table.render(options);

        // 搜索事件
        $("#search-button").on('click',function () {
            search($("#movie-search-val").val());
        });



        //执行一个laydate实例   初始化日期组件
        laydate.render({
            elem: '#datetools' //指定元素
            ,type: 'datetime'
            ,format: 'yyyy-MM-dd HH:mm' //可任意组合
            ,value: arrangeInfo.timeScopeStart
            ,theme:'molv'
            ,done: function (value,date,endDate) {

                // 每次选值  都赋予
                arrangeDateTime = value;
                console.log(arrangeDateTime);

                console.log(value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
            }
        });

        var languages = arrangeInfo.language;

        var languageArray = languages.split(',');

        // 创建对象数组

        var languageList = new Array();

        for (var i = 0;i < languageArray.length;++i){
            var languageObj = new Object();
            languageObj.key = languageArray[i];
            languageObj.value = languageArray[i];
            languageList.push(languageObj);
        }

        putSelectData('language','language',languageList);

        // 设置被选中
        $("#language").val(arrangeInfo.language);

        form.render('select', 'language'); // 动态加载的数据 要经过重新渲染 才能生效

        // 最后还有语言的  要监听当前选中的行
        table.on('radio(movie-table)', function(obj){
            console.log(obj.checked); //当前是否选中状态
            console.log(obj.data); //选中行的相关数据

            movieId = obj.data.movieId;
            // 将当前选择的movieId 存


            // 监听语言的选择

            var languages = obj.data.languages;
            // 得到分开的数组

            var languageArray = languages.split(',');

            // 创建对象数组

            var languageList = new Array();

            for (var i = 0;i < languageArray.length;++i){
                var languageObj = new Object();
                languageObj.key = languageArray[i];
                languageObj.value = languageArray[i];
                languageList.push(languageObj);
            }

            console.log(languageList);
            putSelectData('language','language',languageList);

            form.render('select', 'language'); // 动态加载的数据 要经过重新渲染 才能生效
        });

    });
}

// 搜索
function search(search) {

    //表格重载
    tableObj.reload({
        where:{
            search:search
        },
        page:{
            curr:1
        }
    });

}


// 提交
function formSubmit() {

    // 提交前的校验

    //省市区 影院 放映厅 选中的电影id 时间 语言 价格

    var dateTime = arrangeDateTime;
    var language = $("#language").val();
    var price = $("#price").val();
    var movie = movieId;

    // 清空movieId
    if (dateTime == undefined || dateTime == null){
        layer.msg("请选择时间");
    }else if (language == undefined || language == null){
        layer.msg("请选择语言");
    }else if (price == undefined || price == null){
        layer.msg("请选择价格");
    }else if (movie == undefined || movie == null){
        layer.msg("请选择电影");
    }else{
        // 都有输入

        // 判断价格 合理性
        var priceReg = /(^[-+]?[1-9]\d*(\.\d{1,2})?$)|(^[-+]?[0]{1}(\.\d{1,2})?$)/;
        if (!priceReg.test(price)) {
            layer.msg("价格必须为合法数字(正数，最多两位小数)");
        }else{

            // 价格合理 发送排片请求
            var arrangeObj = new Object();

            arrangeObj.id = $("#arrange-id").val();
            arrangeObj.movieId = movie;
            arrangeObj.language = language;
            arrangeObj.price = price;
            // 时间

            // 截取
            arrangeObj.startTime = dateTime;
            arrangeObj.date = dateTime.split(" ")[0];


            var result = updateArrangeMovie(arrangeObj);

            if (result == true){
                layer.msg("修改成功");
                closeiframe();
                // 打开排片列表
            }else{
                layer.msg(result);
            }

        }

    }



}


// 修改排片
function updateArrangeMovie(arrangeObj) {

    var result;

    $.ajax({
        type:"post",
        async:false,
        url:"http://localhost:8080/api/backend/cinema/update-arrange-info",
        data: {
            id:arrangeObj.id,
            movieId:arrangeObj.movieId,
            date:arrangeObj.date,
            startTime:arrangeObj.startTime,
            price:arrangeObj.price,
            language:arrangeObj.language
        },
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

// 关闭
function closeiframe() {

    layui.use('form',function () {
        var form = layui.form;

        // 关闭
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭

    });

}



// 得到信息 通过
function getArrangeInfoById(arrangeId) {

    var result;
    $.ajax({
        type:"get",
        async:false,
        url:"http://localhost:8080/api/backend/cinema/arrange-records-by-id",
        data: {
            id:arrangeId
        },
        success:function (data,status) {
            if (data.success == true){
                result = data.data;
            }else{
                result = data.message;
            }
        }
    });

    return result;


}






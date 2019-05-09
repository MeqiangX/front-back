

//  电影列表 js

var table;
var form;
var layer;
var $;
var tableObj;
var laydate;
var arrangeDateTime;
var movieId;

var options = {
    elem: '#movie-table'
    ,width:1280
    ,url: 'http://localhost:8082/api/portal/movie/search-movies'//数据接口
    ,method:'get'
    , request:{
        pageName:'current', // 页码的重新命名
        limitName:'size' // 页容的命名
    },
    parseData:function (res) {
        // 返回格式的预解析
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

function init(){

    layui.use(['jquery','table','form','laydate'],function () {
        table = layui.table;
        form = layui.form;
        laydate = layui.laydate;
        $ = layui.$ //重点处
        //第一个实例
        // 搜索按钮绑定事件
        // 初始化表格
        tableObj = table.render(options);

       // 搜索事件
        $("#search-button").on('click',function () {
            search();
        });

        //执行一个laydate实例   初始化日期组件
        laydate.render({
            elem: '#datetools' //指定元素
            ,type: 'datetime'
            ,format: 'yyyy-MM-dd HH:mm' //可任意组合
            ,value: new Date()
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

        // 初始化省份信息 同时监听联动
        // 初始化 省份信息
        var province = provinceData();

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


        // 监听完省市区 的 再监听 影院和放映厅的
        form.on('select(area-select)',function (data) {

            // 监听 影院select

            var cinema = cinemaData(data.value);

            putSelectData('cinema','cinema',cinema);

            form.render('select', 'cinema'); // 动态加载的数据 要经过重新渲染 才能生效

        });

        // 放映厅
        form.on('select(cinema-select)',function (data) {

            // 监听 影院select

            var screen = screenData(data.value);

            putSelectData('screen','screen',screen);

            form.render('select', 'screen'); // 动态加载的数据 要经过重新渲染 才能生效

        });


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
function search() {

    //表格重载
    tableObj.reload({
        where:{
            areaId:areaId,
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

    var province = $("#province").val();
    var city = $("#city").val();
    var area = $("#area").val();
    var cinema = $("#cinema").val();
    var screen = $("#screen").val();
    var dateTime = arrangeDateTime;
    var language = $("#language").val();
    var price = $("#price").val();
    var movie = movieId;

    // 清空movieId

    if (province == undefined || province == null){
        layer.msg("请选择影院所在省份");
    }else if (city == undefined || city == null){
        layer.msg("请选择影院所在市区");
    }else if (area == undefined || area == null){
        layer.msg("请选择影院所在地区");
    }else if (cinema == undefined || cinema == null){
        layer.msg("请选择影院");
    }else if (screen == undefined || screen == null){
        layer.msg("请选择放映厅");
    }else if (dateTime == undefined || dateTime == null){
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

            arrangeObj.cinema = cinema;
            arrangeObj.screen = screen;
            arrangeObj.movieId = movie;
            arrangeObj.language = language;
            arrangeObj.price = price;
            // 时间

            // 截取
            arrangeObj.startTime = dateTime;
            arrangeObj.date = dateTime.split(" ")[0];


            var result = arrangeMovie(arrangeObj);

            if (result == true){
                layer.msg("排片成功");
                // 打开排片列表
            }else{
                layer.msg(result);
            }

        }

    }



}


// 排片
function arrangeMovie(arrangeObj) {

    var result;

    $.ajax({
        type:"post",
        async:false,
        url:"http://localhost:8080/api/backend/cinema/cinema-movie-arrange",
        data: {
            cinemaId:arrangeObj.cinema,
            screenHallId:arrangeObj.screen,
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
function close() {
    window.close();
}










//  影院列表 js

var table;
var form;
var layer;
var $;
var tableObj;
var currentCinemaId;

var options = {
    elem: '#cinema-table'
    ,width:1300
    ,url: 'http://localhost:8080/api/backend/cinema/find-cinema-by-areaId'//数据接口
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
        ,{field: 'id', title: 'ID',width:40,sort: true,align:'center'}
        /*  ,{field: 'image', align:'center',title: '图片', width: 135,height:40,templet:'<div><img src="{{ d.image}}"></div>',style:'height:48px;width:48px;line-height:48px!important;'}*/
        ,{field: 'cinemaName', align:'center',title: '影院名', width:150}
        ,{field: 'phone', align:'center',title: '联系方式', width: 180}
        ,{field: 'cinemaAreaId', align:'center',title: '地区ID', width:80, sort: true}
        ,{field: 'cinemaAreaFullName', align:'center',title: '所在区域', width:180}
        ,{field: 'cinemaFullAddress', align:'center',title: '地址', width: 220}
        ,{field: 'createTime', title: '创建时间', width: 200, sort: true,align:'center'}
        ,{field: 'updateTime', title: '跟新时间', width: 200, sort: true,align:'center'}
    ]]
};

function init(){
    layui.use('table', function(){
        var table = layui.table,$ = layui.$;
        var height = 490; //固定表格高度
        //计算按钮的高度
        var btn_height = height /2 -44;
        $('.btn-height').css('padding-top',btn_height).css('text-align','center')
        //左边表格
        table.render({
            elem: '#left_tab'
            ,cols: [[
                {checkbox: true, fixed: true}
                ,{field:'id', title: 'ID', width:80, sort: true, fixed: true}
                ,{field:'screeningHallName', title: '放映厅'}
                ,{field:'screeningHallX', title: '行数', sort: true}
                ,{field:'screeningHallY', title: '列数', sort: true}

            ]]
            ,data: []
            ,id: 'left_table_id'
            ,page: true
            ,height: height
        });
        //右边表格
        table.render({
            elem: '#right_tab'
            ,cols: [[
                {checkbox: true, fixed: true}
                ,{field:'id', title: 'ID', width:80, sort: true, fixed: true}
                ,{field:'screeningHallName', title: '放映厅'}
                ,{field:'screeningHallX', title: '行数', sort: true}
                ,{field:'screeningHallY', title: '列数', sort: true}

            ]]
            ,data: []
            ,id: 'right_table_id'
            ,page: true
            ,height: height
        });

        //监听左表格选中
        table.on('checkbox(left)', function(obj){
            btnIf(getTableData('left_table_id'),'.left-btn')
        });
        //监听右表格选中
        table.on('checkbox(right)', function(obj){
            btnIf(getTableData('right_table_id'),'.right-btn')
        });

        //左按钮点击移动数据
        $('.left-btn').on('click',function(){
            if(!$(this).hasClass('layui-btn-disabled')){
                $('.left-btn,.right-btn').addClass('layui-btn-disabled')

                //得到 要配置给当前cinemaId 的 放映厅列表

                // 触发接口
                var data = getTableData('left_table_id');

                var idList = new Array();
                for (var i = 0; i < data.length;++i){
                    idList.push(data[i].id);
                }

                var result = sendCinemaScreenConfig(0,idList,currentCinemaId);

                if (result == true){
                    layer.msg("添加放映厅成功");
                    // 重载两个表格数据
                    reloadTable('left_table_id','http://localhost:8080/api/backend/screen/querypage-canConfig-screens-by-cinemaId');
                    //右边
                    reloadTable('right_table_id','http://localhost:8080/api/backend/screen/querypage-screens-by-cinemaId');
                }else{
                    layer.msg(result);
                }


            }
        })

        //右按钮点击移动数据
        $('.right-btn').on('click',function () {
            if(!$(this).hasClass('layui-btn-disabled')){
                $('.left-btn,.right-btn').addClass('layui-btn-disabled')

                var data = getTableData('right_table_id');
                var idList = new Array();
                for (var i = 0; i < data.length;++i){
                    idList.push(data[i].id);
                }

                var result = sendCinemaScreenConfig(1,idList,currentCinemaId);

                if (result == true){
                    layer.msg("移除放映厅成功");
                    // 重载两个表格数据
                    reloadTable('left_table_id','http://localhost:8080/api/backend/screen/querypage-canConfig-screens-by-cinemaId');
                    //右边
                    reloadTable('right_table_id','http://localhost:8080/api/backend/screen/querypage-screens-by-cinemaId');
                }else{
                    layer.msg(result);
                }

                // 重载两个表格数据
                reloadTable('left_table_id','http://localhost:8080/api/backend/screen/querypage-canConfig-screens-by-cinemaId');
                //右边
                reloadTable('right_table_id','http://localhost:8080/api/backend/screen/querypage-screens-by-cinemaId');
            }
        })

    });

    layui.use(['jquery','table','form'],function () {
        table = layui.table;
        form = layui.form;
        $ = layui.$ //重点处
        //第一个实例
        // 搜索按钮绑定事件
        // 初始化表格
        tableObj = table.render(options);

        // 初始化 省份信息
        var province = provinceData();

        putSelectData('province','provice',province);

        form.render('select', 'provice'); // 动态加载的数据 要经过重新渲染 才能生效

         // 监听 省份select
        form.on('select(provice-select)', function(data){
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

        $("#search-button").on('click',function () {
            search($("#area").val(),$("#cinema-search-val").val());
        });


        // 监听单击选中事件
        table.on('radio(cinema-table)', function(obj){
            console.log(obj.checked); //当前是否选中状态
            console.log(obj.data); //选中行的相关数据

            //选中之后 用 影院的id 找 可配置的放映厅 和已经配置的放映厅
            currentCinemaId = obj.data.id;

            // 重载两个表格数据
            reloadTable('left_table_id','http://localhost:8080/api/backend/screen/querypage-canConfig-screens-by-cinemaId');

            //右边
            reloadTable('right_table_id','http://localhost:8080/api/backend/screen/querypage-screens-by-cinemaId');


        });
        /*var checkStatus = table.checkStatus('idTest')
            ,data = checkStatus.data;*/  //  获得当前选中的行记录

    });
}



// 搜索
function search(areaId,search) {

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

//公共方法
function getTableData(id){
    var checkStatus = table.checkStatus(id)
        ,data = checkStatus.data;

    console.log(data);

    return data;
}
function btnIf(data,btn){
    if(data && data.length){
        $(btn).removeClass('layui-btn-disabled')
    }else{
        $(btn).addClass('layui-btn-disabled')
    }
}
//重载表格
function reloadTable(id,url) {

    table.reload(id,{
        url: url//数据接口
        ,method:'get'
        , request:{
            pageName:'current', // 页码的重新命名
            limitName:'size' // 页容的命名
        },
        page:{curr:1},
        where:{
            cinemaId:currentCinemaId
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
    });
}

// 0 add  1 remove
function sendCinemaScreenConfig(option,data,cinemaId) {

    var cinemaScreenUpdatePo = new Object();
    cinemaScreenUpdatePo.cinemaId = cinemaId;
    cinemaScreenUpdatePo.screenHallIdList = data;
    cinemaScreenUpdatePo.option = option;


    console.log(JSON.stringify(cinemaScreenUpdatePo));

    var result;
    $.ajax({
        type:"post",
        async:false,
        url:"http://localhost:8080/api/backend/cinema/cinema-screen-config",
        dataType:"json",
        contentType:"application/json",
        data: JSON.stringify(cinemaScreenUpdatePo),
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








//  影院列表 js

var table;
var form;
var layer;
var $;
var tableObj;


var options = {
    elem: '#cinema-table'
    ,width: 1500
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
        {field: 'id', title: 'ID',width:40,sort: true,align:'center'}
        /*  ,{field: 'image', align:'center',title: '图片', width: 135,height:40,templet:'<div><img src="{{ d.image}}"></div>',style:'height:48px;width:48px;line-height:48px!important;'}*/
        ,{field: 'cinemaName', align:'center',title: '影院名', width:150}
        ,{field: 'phone', align:'center',title: '联系方式', width: 180}
        ,{field: 'cinemaAreaId', align:'center',title: '地区ID', width:80, sort: true}
        ,{field: 'cinemaAreaFullName', align:'center',title: '所在区域', width:180}
        ,{field: 'cinemaFullAddress', align:'center',title: '地址', width: 220}
        ,{field: 'createTime', title: '创建时间', width: 200, sort: true,align:'center'}
        ,{field: 'updateTime', title: '跟新时间', width: 200, sort: true,align:'center'}
        ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:250}
    ]]
};

function init(){

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

        //监听工具条
        table.on('tool(cinema-table)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){

                //  查看操作
                layer.open({
                    type: 2,
                    area: ['900px', '500px'],
                    content: 'cinema_info.html?id='+data.id //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
                });
                //layer.msg('ID：'+ data.id + ' 的查看操作');
            } else if(obj.event === 'del'){

                // 删除操作
                layer.confirm('确定删除该条记录吗？操作不可回退', function(index){
                    // 需要执行的请求
                    var result;
                    $.ajax({
                        type:"get",
                        async:false,
                        url:"http://localhost:8080/api/backend/cinema/del-by-id",
                        data:{
                            cinemaId:data.id
                        },
                        success:function (data,status) {
                            if (data.success == true){
                                result = data.data;
                            }else{
                                result = data.message;
                            }
                        }
                    });

                    if (result == true){
                        obj.del(); // 表单的虚拟删除
                        layer.close(index);
                        layer.msg("删除成功");
                        // 刷新表格
                        search($("#area").val(),$("#cinema-search-val").val());
                    }else{
                        // 删除失败
                        layer.msg(result);
                    }
                });
            } else if(obj.event === 'edit'){
                // 编辑操作
                layer.open({
                    type: 2,
                    area: ['900px', '500px'],
                    content: 'cinema_edit.html?id='+data.id, //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
                    end:function () {
                        // 关闭之后 的代码
                        // 重载表格
                        search($("#area").val(),$("#cinema-search-val").val());
                    }
                });
                /*layer.alert('编辑行：<br>'+ JSON.stringify(data))*/
            }
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







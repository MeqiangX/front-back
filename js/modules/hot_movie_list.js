

//  热播榜 js

var table;
var form;
var layer;
var $;
var tableObj;


var options = {
    elem: '#movie-table'
    ,width:1300
    ,url: 'http://localhost:8082/api/portal/movie/movie-rank'//数据接口
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
    ,where:{
        rankType:'0',
    }
    ,page: true //开启分页
    ,cols: [[ //表头
        {type:"numbers",title: '排名',width:100,sort: true,align:'center'}
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
        ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:120}
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

       // 搜索事件
        $("#search-button").on('click',function () {
            search();
        });

        //监听工具条  电影列表 应该只有查看的功能
        table.on('tool(cinema-table)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){

                //  查看操作
                layer.open({
                    type: 2,
                    area: ['900px', '500px'],
                    content: 'cinema_info.html?id='+data.id //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
                });
                layer.msg('ID：'+ data.id + ' 的查看操作');
            }
        });
        /*var checkStatus = table.checkStatus('idTest')
            ,data = checkStatus.data;*/  //  获得当前选中的行记录

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







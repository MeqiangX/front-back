

//  放映厅列表 js

var table;
var form;
var layer;
var $;
var tableObj;


var options = {
    elem: '#screen-table'
    ,width:1300
    ,url: 'http://localhost:8080/api/backend/screen/query-screens-page'//数据接口
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
   /* ,where:{
        screeningHallName:''
    }*/
    ,page: true //开启分页
    ,cols: [[ //表头
        {field: 'id', title: 'ID',width:40,sort: true,align:'center'}
        /*  ,{field: 'image', align:'center',title: '图片', width: 135,height:40,templet:'<div><img src="{{ d.image}}"></div>',style:'height:48px;width:48px;line-height:48px!important;'}*/
        ,{field: 'screeningHallName', align:'center',title: '放映厅', width:150}
        ,{field: 'screeningHallX', align:'center',title: '列数', width: 180}
        ,{field: 'screeningHallY', align:'center',title: '排数', width:80, sort: true}
        ,{field: 'creator', align:'center',title: '创建人', width:180}
        ,{field: 'updator', align:'center',title: '修改人', width: 220}
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


        // 监听search
        $("#search-button").on('click',function () {
            search($("#screen-search-val").val());
        });

        //监听工具条
        table.on('tool(screen-table)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){
                //  查看操作
                layer.open({
                    type: 2,
                    area: ['700px', '400px'],
                    content: 'screen_info.html?id='+data.id //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
                });
                layer.msg('ID：'+ data.id + ' 的查看操作');
            } else if(obj.event === 'del'){
                // 删除操作  判断是否排片
                layer.confirm('真的删除行么', function(index){

                    var isArranged = isScreenArrange(data.id);

                    if (isArranged != false){
                        layer.msg("当前放映厅有排片记录，无法删除，请先完成之前的排片或者取消排片再操作");
                    }else{
                        // 需要执行的请求
                        var result;
                        $.ajax({
                            type:"get",
                            async:false,
                            url:"http://localhost:8080/api/backend/screen/delete-screen-by-id",
                            data:{
                                id:data.id
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
                            search($("#screen-search-val").val());
                        }else{
                            // 删除失败
                            layer.msg(result);
                        }
                    }

                });
            } else if(obj.event === 'edit'){
                // 编辑操作
                layer.open({
                    type: 2,
                    area: ['900px', '500px'],
                    content: 'screen_edit.html?id='+data.id, //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
                    end:function () {
                        // 关闭之后 的代码
                        // 重载表格
                        search($("#screen-search-val").val());
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
function search(screeningHallName) {

    tableObj.reload({
        where:{
            screeningHallName:screeningHallName
        },
        page:{
            curr:1
        }
    });

}

// 查看id 的放映厅是否有排片
function isScreenArrange(screenId) {

    var result;

    $.ajax({
        type:"get",
        async:false,
        url:"http://localhost:8080/api/backend/screen/is-arranged",
        data:{
            id:screenId
        },
        success:function (data,status) {
            if (data.success == true){
                result = data.data;
            }
        }
    });

    return result;
}







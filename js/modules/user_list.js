

//  用户列表 js

var table;
var form;
var layer;
var $;
var tableObj;


var options = {
    elem: '#user-table'
    ,width: 1400
    ,url: 'http://localhost:8084/api/uc/user/users-page'//数据接口
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
        ,{field: 'userName', align:'center',title: '用户名', width:150}
        ,{field: 'userPassword', align:'center',title: '用户密码', width: 180}
        ,{field: 'phone', align:'center',title: '手机', width:150, sort: true}
        ,{field: 'email', align:'center',title: '邮箱', width:150}
        ,{field: 'status', align:'center',title: '状态', width: 220,templet: "<div>{{0 == d.status ? '正常':'冻结'}}</div>"}
        ,{field: 'creator', title: '创建人', width: 200,align:'center'}
        ,{field: 'updator', title: '跟新人', width: 200,align:'center'}
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

        $("#search-button").on('click',function () {
            search($("#user-search-val").val());
        });

        //监听工具条
        table.on('tool(user-table)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){

                //  查看操作
                layer.open({
                    type: 2,
                    area: ['900px', '500px'],
                    content: 'user_info.html?id='+data.id //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
                });
                layer.msg('ID：'+ data.id + ' 的查看操作');
            } else if(obj.event === 'del'){

                // 删除操作
                layer.confirm('确定要删除该用户吗，同时会删除用户的信息和订单', function(index){


                    // 删除订单
                    var orderDel;
                    $.ajax({
                        type:"get",
                        async:false,
                        url:"http://localhost:8082/api/portal/order/delete-user-orders",
                        data:{
                            userId:data.id
                        },
                        success:function (data,status) {
                            if (data.success == true){
                                result = data.data;
                            }else{
                                result = data.message;
                            }
                        }
                    });

                    // 删除用户

                    // 需要执行的请求
                    var result;
                    $.ajax({
                        type:"get",
                        async:false,
                        url:"http://localhost:8084/api/uc/useradmin/delete-user-by-id",
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
                        search($("#user-search-val").val());
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
                    content: 'user_edit.html?id='+data.id, //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
                    end:function () {
                        // 关闭之后 的代码
                        // 重载表格
                        search($("#user-search-val").val());
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
function search(search) {

    tableObj.reload({
        where:{
            search:search
        },
        page:{
            curr:1
        }
    });

}







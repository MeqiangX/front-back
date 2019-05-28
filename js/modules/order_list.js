

//  订单列表 js

var table;
var form;
var layer;
var $;
var tableObj;


var options = {
    elem: '#order-table'
    ,width: 1400
    ,url: 'http://localhost:8082/api/portal/order/user-orders'//数据接口
    ,method:'post'
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
    ,page: true //开启分页
    ,cols: [[ //表头
        {field: 'orderId', title: '订单号',width:200,sort: true,align:'center'}
        /*  ,{field: 'image', align:'center',title: '图片', width: 135,height:40,templet:'<div><img src="{{ d.image}}"></div>',style:'height:48px;width:48px;line-height:48px!important;'}*/
        ,{field: 'userId', align:'center',title: '用户id', sort: true,width:150}
        ,{field: 'movieName', align:'center',title: '电影', width: 180}
        ,{field: 'cinemaName', align:'center',title: '影院', width: 220}
        ,{field: 'screeningHallName', title: "放映厅", width: 200,align:'center'}
        ,{field: 'timeScopeStart', title: '开始时间', width: 200, sort: true,align:'center'}
        ,{field: 'price', title: '支付价格', width: 200, sort: true,align:'center'}
        ,{field: 'status', title: '支付状态', width: 200,align:'center' ,templet: "<div>{{#  if(d.status == 0){ }}\n" +
            " 未支付\n" +
            "{{#  } else if (d.status == 1) { }}\n" +
            " 已支付\n" +
            "{{#  } else { }}\n" +
            " 已完成\n" +
            "{{#  } }}</div>"}
        ,{field: 'seats', title: '座位', width: 200,align:'center'}
        ,{field: 'createTime', title: '订单创建时间', width: 200, sort: true,align:'center'}
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
            search($("#order-search-val").val(),$("#order-search-val").val());
        });

        //监听工具条
        table.on('tool(order-table)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){

                //  查看操作
                layer.open({
                    type: 2,
                    area: ['800px', '600px'],
                    content: 'order_info.html?id='+data.orderId //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
                });
            } else if(obj.event === 'del'){

                // 删除操作
                layer.confirm('真的要删除该订单吗？', function(index){

                    // 需要执行的请求
                    var result;
                    $.ajax({
                        type:"get",
                        async:false,
                        url:"http://localhost:8082/api/portal/order/order-detail",
                        data:{
                            orderId:data.orderId
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
                        search($("#order-search-val").val(),$("#order-search-val").val());
                    }else{
                        // 删除失败
                        layer.msg(result);
                    }
                });
            }
        });
        /*var checkStatus = table.checkStatus('idTest')
            ,data = checkStatus.data;*/  //  获得当前选中的行记录

    });
}



// 搜索
  function search(orderId,userId) {

    tableObj.reload({
        where:{
            orderId:orderId,
            userId:userId
        },
        page:{
            curr:1
        }
    });

}







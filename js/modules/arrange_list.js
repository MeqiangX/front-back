


//  排片列表 js

var table;
var form;
var layer;
var $;
var tableObj;
var laydate;
var arrangeDate;

var options = {
    elem: '#arrange-table'
    ,width: 1400
    ,url: 'http://localhost:8080/api/backend/cinema/arrange-records'//数据接口
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
        ,{field: 'cinemaName', align:'center',title: '影院', width:150}
        ,{field: 'screeningHallName', align:'center',title: '放映厅', width: 180}
        ,{field: 'movieName', align:'center',title: '电影', width:80, sort: true}
        ,{field: 'arrangeDate', align:'center',title: '日期', width:180}
        ,{field: 'timeScopeStart', align:'center',title: '开始时间', width: 220}
        ,{field: 'price', title: '价格', width: 200, sort: true,align:'center'}
        ,{field: 'language', title: '语言', width: 200, sort: true,align:'center'}
        ,{field: 'createTime', title: '创建时间', width: 200, sort: true,align:'center'}
        ,{field: 'updateTime', title: '修改时间', width: 200, sort: true,align:'center'}
        ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:250}
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

        $("#search-button").on('click',function () {
            search($("#cinema-search-val").val(),$("#movie-search-val").val());
        });

        //执行一个laydate实例   初始化日期组件
        laydate.render({
            elem: '#datetools' //指定元素
            ,type: 'date'
            ,range:'T'// 默认不选日期 范围为空
            //,value: new Date()
            ,theme:'molv'
            ,done: function (value,date,endDate) {

                // 每次选值  都赋予
                arrangeDate = value;
                console.log(arrangeDate);

                console.log(value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
            }
        });

        // 初始化表格
        tableObj = table.render(options);

        //监听工具条
        table.on('tool(arrange-table)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){

                //  查看操作
                layer.open({
                    type: 2,
                    area: ['900px', '500px'],
                    content: 'arrange_info.html?id='+data.id //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
                });
                layer.msg('ID：'+ data.id + ' 的查看操作');
            } else if(obj.event === 'del'){

                // 删除操作
                layer.confirm('真的删除该排片记录么，请确保当前排片记录未出售', function(index){

                    // 需要执行的请求
                    var result;
                    $.ajax({
                        type:"get",
                        async:false,
                        url:"http://localhost:8080/api/backend/cinema/delete-arrange-record",
                        data:{
                            arrangeId:data.id
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
                        search($("#cinema-search-val").val(),$("#movie-search-val").val());
                    }else{
                        // 删除失败
                        layer.msg(result);
                    }
                });
            } else if(obj.event === 'edit'){
                // 编辑操作
                var editiframe = layer.open({
                    type: 2,
                    area: ['900px', '500px'],
                    content: 'arrange_edit.html?id='+data.id, //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
                    maxmin: true, // 全屏
                    end:function () {
                        // 关闭之后 的代码
                        // 重载表格
                        search($("#cinema-search-val").val(),$("#movie-search-val").val());
                    }
                });

                // 全屏打开
                layer.full(editiframe);
                /*layer.alert('编辑行：<br>'+ JSON.stringify(data))*/
            }
        });
        /*var checkStatus = table.checkStatus('idTest')
            ,data = checkStatus.data;*/  //  获得当前选中的行记录

    });
}



// 搜索 日期 影院 电影
function search(cinemaName,movieName) {

    // 搜索 点击  查看日期

    console.log(" 日期 ： "+ arrangeDate + " --  影院名：" + cinemaName + "-== 电影名：" + movieName);

    tableObj.reload({
        where:{
            arrangeDate:arrangeDate == undefined ? null : arrangeDate,
            cinemaName:cinemaName == undefined ? null : cinemaName,
            movieName:movieName == undefined ? null : movieName
        },
        page:{
            curr:1
        }
    });

}


// 获得当前日期 - - 分割
function currDate() {
    // 获取当前日期
    var date = new Date();

// 获取当前月份
    var nowMonth = date.getMonth() + 1;

// 获取当前是几号
    var strDate = date.getDate();

// 添加分隔符“-”
    var seperator = "-";

// 对月份进行处理，1-9月在前面添加一个“0”
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
    }

// 对月份进行处理，1-9号在前面添加一个“0”
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

// 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;

    return nowDate;
}







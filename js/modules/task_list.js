


//  排片列表 js

var table;
var form;
var layer;
var $;
var tableObj;
var laydate;
var arrangeDate;

var options = {
    elem: '#task-table'
    ,width:1300
    ,url: 'http://localhost:8080/api/backend/taskmanage/task-records'//数据接口
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
        ,{field: 'taskName', align:'center',title: '执行任务', width:150}
        ,{field: 'spendTime', align:'center',title: '耗时/ms', sort: true,width: 180}
        ,{field: 'success', align:'center',title: '成功', width:80, templet: "<div>{{0 == d.success ? '是':'否'}}</div>"}
        ,{field: 'errMessage', align:'center',title: '错误信息', width: 220}
        ,{field: 'createTime', title: '创建时间', width: 200, sort: true,align:'center'}
        ,{field: 'updateTime', title: '修改时间', width: 200, sort: true,align:'center'}
        ,{field: 'creator', title: '创建人', width: 200, align:'center'}
        ,{field: 'updator', title: '修改人', width: 200, align:'center'}
        /*,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:250}*/
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
            console.log($("#task").val());
            search($("#task").val());
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

        /*var checkStatus = table.checkStatus('idTest')
            ,data = checkStatus.data;*/  //  获得当前选中的行记录


        var tasks = getTaskType();

        putSelectData('task','task',tasks);

        form.render('select', 'task'); // 动态加载的数据 要经过重新渲染 才能生效

    });
}


// 得到任务类型
function getTaskType() {

    // 初始化  任务类型数据
    var task;
    $.ajax({
        type:"get",
        async:false,
        url:"http://localhost:8080/api/backend/taskmanage/task-type",
        success:function (data,status) {
            task = data.data;
        }
    });

    return task;

}

// 搜索 时间范围 任务类型
function search(taskType) {

    // 搜索 点击  查看日期


    var timeattr = arrangeDate.split("T");

    var start = timeattr[0];
    var end = timeattr[1];
    tableObj.reload({
        where:{
            taskType:taskType,
            startDate:start == undefined ? null : start.trim(),
            endDate:end == undefined ? null : end.trim()
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









/*welcome*/

var $;
var layer;


layui.use(['layer','jquery'],function () {
    $ = layui.jquery,
    layer = layui.layer;
    init();
});


// 初始化界面
function init() {

    // 填充时间 管理员名称

    // 时间
    timeclock("clock");

    // 名称
    var adminDataTable = layui.data('user');
    $(".admin-name").text(adminDataTable.admin.userName);


    var paneDataList = paneData();

    console.log(paneDataList);

    if (paneDataList != null){

        $("#cinema-count").text( paneDataList[0].count);
        $("#cinema-name").text(paneDataList[0].name);

        $("#screen-count").text( paneDataList[1].count);
        $("#screen-name").text(paneDataList[1].name);

        $("#movie-count").text( paneDataList[2].count);
        $("#movie-name").text(paneDataList[2].name);

        $("#order-count").text( paneDataList[3].count);
        $("#order-name").text(paneDataList[3].name);

        $("#user-count").text( paneDataList[4].count);
        $("#user-name").text(paneDataList[4].name);

        $("#admin-count").text( paneDataList[5].count);
        $("#admin-name").text(paneDataList[5].name);
    }


    // --- 最近一年的数据
    //得到最近一年的年份月份
   /* var lastYearList = lastYear();

    var startYear = lastYearList[0].substr(0,4);
    var startMonth = parseInt(lastYearList[0].substr(4,2));

    var endYear = lastYearList[11].substr(0,4);
    var endMonth = parseInt(lastYearList[11].substr(4,2));

    // 最近一年的数据
    var movieYearData = lastYearData(0,startYear,startMonth,endYear,endMonth);

    //影院
    var cinemaYearData = lastYearData(1,startYear,startMonth,endYear,endMonth);

    // 用户
    var userYearData = lastYearData(2,startYear,startMonth,endYear,endMonth);

    // 订单
    var orderYearData = lastYearData(3,startYear,startMonth,endYear,endMonth);*/



   //  最近三十天的数据
    var startDate = new Date((new Date().getTime()-1000*60*60*24*29));  //29
    startDate=dateFormat(startDate);

    var endDate = new Date((new Date().getTime()));  //now
    endDate=dateFormat(endDate);

    var movieYearData = last30DData(0,startDate,endDate);
    var cinemaYearData = last30DData(1,startDate,endDate);
    var userYearData = last30DData(2,startDate,endDate);
    var orderYearData = last30DData(3,startDate,endDate);
    // 转换成 key 数组 和 value 数组

    var dateArray = new Array();
    var countArray = new Array();

    for (var i = 0; i < movieYearData.length;++i){
        dateArray.push(movieYearData[i].date);
        countArray.push(movieYearData[i].count);
    }


    var cinemaDateArray = new Array();
    var cinemaCountArray = new Array();

    for (var i = 0; i < cinemaYearData.length;++i){
        cinemaDateArray.push(cinemaYearData[i].date);
        cinemaCountArray.push(cinemaYearData[i].count);
    }


    var userDateArray = new Array();
    var userCountArray = new Array();

    for (var i = 0; i < userYearData.length;++i){
        userDateArray.push(userYearData[i].date);
        userCountArray.push(userYearData[i].count);
    }


    var orderDateArray = new Array();
    var orderCountArray = new Array();

    for (var i = 0; i < orderYearData.length;++i){
        orderDateArray.push(orderYearData[i].date);
        orderCountArray.push(orderYearData[i].count);
    }


    // 基于准备好的dom，初始化echarts实例
    var movieChart = echarts.init(document.getElementById('movie-charts'));
    var cinemaChart = echarts.init(document.getElementById('cinema-charts'));
    var userChart = echarts.init(document.getElementById('user-charts'));
    var orderChart = echarts.init(document.getElementById('order-charts'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '最近30天电影数变化折线图'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['电影']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : dateArray
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'电影',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data:countArray
            }
        ]
    };


    // 指定图表的配置项和数据  影院数据
    var cinemaOption = {
        title: {
            text: '最近30天影院数变化折线图'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['影院']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : cinemaDateArray
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'影院',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data:cinemaCountArray
            }
        ]
    };

    // 指定图表的配置项和数据  用户数据
    var userOption = {
        title: {
            text: '最近30天用户数变化折线图'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['用户']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : userDateArray
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'用户',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data:userCountArray
            }
        ]
    };


    // 指定图表的配置项和数据  订单数据
    var orderOption = {
        title: {
            text: '最近30天订单数变化折线图'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['订单']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : orderDateArray
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'订单',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data:orderCountArray
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    movieChart.setOption(option);
    cinemaChart.setOption(cinemaOption);
    userChart.setOption(userOption);
    orderChart.setOption(orderOption);
}


// 截止目前的统计
function paneData() {

    var result;
    $.ajax({
        type:"get",
        async:false,
        url:"http://localhost:8080/api/backend/welcome/pane-data",
        success:function (data,status) {
            if (data.success === true)
            result = data.data;
        }
    });
    return result;
}


//  最近一年的数据
function lastYearData(option,startYear,startMonth,endYear,endMonth) {

    var result;
    $.ajax({
        type:"get",
        async:false,
        url:"http://localhost:8080/api/backend/welcome/echarts-option",
        data:{
            option:option,
            startYear:startYear,
            startMonth:startMonth,
            endYear:endYear,
            endMonth:endMonth
        },
        success:function (data,status) {
            if (data.success === true)
                result = data.data;
        }
    });
    return result;
}


// 最近三十天的数据
function last30DData(option,startDate,endDate) {

    var result;
    $.ajax({
        type:"get",
        async:false,
        url:"http://localhost:8080/api/backend/welcome/echarts-option",
        data:{
            option:option,
            startDate:startDate,
            endDate:endDate
        },
        success:function (data,status) {
            if (data.success === true)
                result = data.data;
        }
    });
    return result;
}

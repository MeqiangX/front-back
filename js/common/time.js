

// 最近12个月 数组
function lastYear() {
    var last_year_month = function() {
        var d = new Date();
        var result = [];
        for(var i = 0; i < 12; i++) {
            d.setMonth(d.getMonth() - 1);
            var m = d.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            //在这里可以自定义输出的日期格式
//					result.push(d.getFullYear() + "-" + m);
            result.push(d.getFullYear() + pad(m,2));
        }
        return result;
    }

    return last_year_month().reverse();
}



// 数字格式化

function pad(num, n) {
    return Array(n > num ? (n - ('' + num).length + 1) : 0).join(0) + num;
}


//  当前日期加上 分钟后的日期
function arrangeInitTime(minutes) {

    var date = new Date();
    date.setMinutes(date.getMinutes() + minutes);

    return date;
}


// 时钟

function timeclock(idDom){
    setInterval(function(){
        var time=new Date();
        var year=time.getFullYear();  //获取年份
        var month=time.getMonth()+1;  //获取月份
        var day=time.getDate();   //获取日期
        var hour=checkTime(time.getHours());   //获取时
        var minite=checkTime(time.getMinutes());  //获取分
        var second=checkTime(time.getSeconds());  //获取秒
        /****当时、分、秒、小于10时，则添加0****/
        function checkTime(i){
            if(i<10) return "0"+i;
            return i;
        }
        var box=document.getElementById(idDom);
        box.innerHTML=year+"年"+month+"月"+day+"日  "+hour+":"+minite+":"+second;
    },1000);     //setInterval(fn,i) 定时器，每隔i秒执行fn
}



// 传入时间是否 是当前时间的30分钟后
function arrangeAvalable(arrangeTime,now) {

    var arrange = new Date(arrangeTime);
    /*arrange.setMinutes (arrange.getMinutes () - 15);  // 看放映时间前15 分钟和 当前时间的比较 arrange > now 才能操作*/

    var time = diffTime(now,arrange);
    console
        .log(arrange);
    console
        .log(time);
    if (time >= 0){
        return true;
    }

    return false;

}




function diffTime(startDate,endDate) {
    startDate= new Date(startDate);
    endDate = new Date(endDate);
    console
        .log(endDate);
    var diff=endDate.getTime() - startDate.getTime();//时间差的毫秒数

    return diff / 1000 / 60;
}





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


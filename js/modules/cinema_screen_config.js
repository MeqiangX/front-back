

// 配置放映厅

layui.config({
    base: '../js/layui_exts/transfer/'
}).use(['transfer'],function () {
    var transfer = layui.transfer,$ = layui.$;
    //数据源  异步加载数据源
    var data1 = [{'id':'10001','name':'杜甫','sex':'男'},{'id':'10002','name':'李白','sex':'男'},{'id':'10003','name':'王勃','sex':'男'},{'id':'10004','name':'李清照','sex':'男'},{'id':'10004','name':'李清照','sex':'男'},{'id':'10004','name':'李清照','sex':'男'},{'id':'10004','name':'李清照','sex':'男'}];
    var data2 = [{'id':'10005','name':'白居易','sex':'男'}];
    //表格列
    var cols = [{type: 'checkbox', fixed: 'left'},{field: 'id', title: 'ID', width: 80, sort: true},{field: 'name', title: '用户名'},{field: 'sex', title: '性别'}]
    //表格配置文件
    var tabConfig = {'page':true,'limits':[10,50,100],'height':300}

    var tb1 = transfer.render({
        elem: "#root", //指定元素
        cols: cols, //表格列  支持layui数据表格所有配置
        data: [data1,data2], //[左表数据,右表数据[非必填]]
        tabConfig: tabConfig //表格配置项 支持layui数据表格所有配置
    });


    //transfer.get(参数1:初始化返回值,参数2:获取数据[all,left,right,l,r],参数:指定数据字段)
    $('.all').on('click',function () {
        var data = transfer.get(tb1,'all');
        layer.msg(JSON.stringify(data))
    });
    $('.left').on('click',function () {
        var data = transfer.get(tb1,'left','id');
        layer.msg(JSON.stringify(data))
    });
    $('.right').on('click',function () {
        var data = transfer.get(tb1,'r');
        layer.msg(JSON.stringify(data))
    });
});
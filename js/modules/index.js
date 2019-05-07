var element;
var $;
//JavaScript代码区域
layui.use(['jquery','element'], function(){
    element = layui.element;
    $ = layui.jquery;

    putName(); //填充个人信息

    // 左侧导航的监听事件
    element.on('nav(nav-left)',function (elem) {
     /*   console
            .log($(elem));
        console.log($(elem).attr("lay-id")); // 拿到当前点击的导航id 去tab 中找到对应的tab 显示  如果已经存在 则选中 没有则添加
*/
        var layId = $(elem).attr("lay-id");

        console.log("layId = "+layId);
        // 找到lay-id = lay-id 的 tab  --->  没有则创建   有则addClass
        // 一级菜单不弹出tab
        if (layId != undefined){
            var str = new String();
            if (layId == 1){
                str = "<iframe src=\"cinema_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 2){
                str = " <iframe src=\"cinema_screen_config.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 3){
                str = "<iframe src=\"cinema_edit.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 4){
                str = "<iframe src=\"screen_hall_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 5){
                str = "<iframe src=\"screen_edit.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 6){
                str = "<iframe src=\"arrange_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 8){
                str = "<iframe src=\"movie_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 9){
                str = "<iframe src=\"hot_movie_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 10){
                str = "<iframe src=\"new_movie_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 11){
                str = "<iframe src=\"north_movie_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 12){
                str = "<iframe src=\"week_movie_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 13){
                str = "<iframe src=\"comming_movie_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 14){
                str = "<iframe src=\"top100_movie_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 15){
                str = "<iframe src=\"user_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 16){
                str = "<iframe src=\"user_edit.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 17){
                str = "<iframe src=\"order_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 18){
                str = "<iframe src=\"user_admin_list.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 19){
                str = "<iframe src=\"user_admin_edit.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }else if (layId == 20){
                str = "<iframe src=\"self_info.html\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\"></iframe>";
            }

            navToTab($(elem).attr("lay-id"),$(elem).text(),str);

        }

    });
    
    // 头部导航的监听事件
    element.on('nav(nav-header)',function (elem) {
        navToTab($(elem).attr("lay-id"),$(elem).text(),"内容");
    });

});


// 左侧导航 & 上面导航 和 tab的互动
function navToTab(layId,title,content) {

    var chooseTab = $("li[lay-id='"+ layId +"']");

    console.log(chooseTab);

    if (chooseTab.length == 0){
        // 未找到  add
        element.tabAdd('tab-nav',{
           title:title,
            content:content,
            id:layId
        });
    }
        // 找到了 显示
        $(".layui-this").removeClass("layui-this"); // 清除之前选中的 显示

        // 为当前这个tab 添加显示样式
        chooseTab.addClass("layui-this");

        //可能要对tab进行重新渲染;  参照官方文档来说 动态生成的元素 layui 功能将不会生效 需要render(type,filter) 来重新渲染

        // 切换
        element.tabChange('tab-nav',layId);


}

// 登出
function logout() {

    // 清空 data.user
    var userDataTable = layui.data('user');

    console.log(userDataTable.admin); // 获得当前管理员信息

    // 清除
    //【删】：删除test表的nickname字段
    layui.data('user', {
        key: 'admin'
        ,remove: true
    });
    // 再次查看是否清除
   /* var userDataTable = layui.data('user');

    console.log("清除后："+userDataTable.admin); // 获得当前管理员信息*/
    // 返回到登录页面
    window.location.href="login.html";

}

// 填充管理员名称
function putName() {

    var adminDataTable = layui.data("user");

    if (adminDataTable == undefined || adminDataTable == null){
        // 未登录 跳转登录
        window.location.href = "login.html";
    }
    
    $("#admin-name").text(adminDataTable.admin.userName);

}
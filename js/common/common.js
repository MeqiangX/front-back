// 三级联动 省份数据

var $;
layui.use('jquery',function () {
    $ = layui.$;
});

function provinceData() {

        // 初始化  省份数据
        var province;
        $.ajax({
            type:"get",
            async:false,
            url:"http://localhost:8081/api/common/search-province",
            success:function (data,status) {
                province = data.data;
            }
        });

        return province;


}

// 三级联动 根据省份Id 来查找下列城市
function cityData(fatherId) {

        // 根据选择的省份id 来加载 下面的 城市
        var city;
        $.ajax({
            type:"get",
            async:false,
            url:"http://localhost:8081/api/common/underProvCitys",
            data:{
                fatherId:fatherId
            },
            success:function (data,status) {
                city = data.data;
            }
        });

        return city;



}

// 三级联动 根据城市Id 来查找下列区域
function areaData(fatherId) {

// 根据选择的城市id 来加载 下面的 区域
        var area;
        $.ajax({
            type:"get",
            async:false,
            url:"http://localhost:8081/api/common/underProvAreas",
            data:{
                fatherId:fatherId
            },
            success:function (data,status) {
                area = data.data;
            }
        });

        return area;



}


// 区域下的影院信息
function cinemaData(areaId) {

// 根据选择的areaId 来加载 下面的 影院
    var cinema;
    $.ajax({
        type:"get",
        async:false,
        url:"http://localhost:8080/api/backend/cinema/find-all-cinema-areaId",
        data:{
            areaId:areaId
        },
        success:function (data,status) {
            cinema = data.data;
        }
    });

    return cinema;

}


// 影院下的放映厅信息
function screenData(cinemaId) {

// 根据选择的areaId 来加载 下面的 影院
    var screen;
    $.ajax({
        type:"get",
        async:false,
        url:"http://localhost:8080/api/backend/screen/query-screens-by-cinemaId",
        data:{
            cinemaId:cinemaId
        },
        success:function (data,status) {
            screen = data.data;
        }
    });

    return screen;

}

// 填充select
function putSelectData(option,selector,data) {


        $("#"+selector).empty();

        var str = new String();

        if (option == 'province'){
            for (var i = 0;i < data.length;++i){

                str = str + "<option value=\""+ data[i].provinceId +"\">"+ data[i].province +"</option>\n";

            }
        }else if (option == 'city'){
            for (var i = 0;i < data.length;++i){

                str = str + "<option value=\""+ data[i].cityId +"\">"+ data[i].city +"</option>\n";

            }
        }else if (option == 'area'){
            for (var i = 0;i < data.length;++i){

                str = str + "<option value=\""+ data[i].areaId +"\">"+ data[i].area +"</option>\n";

            }
        }else if (option == 'cinema'){
            for (var i = 0;i < data.length;++i){

                str = str + "<option value=\""+ data[i].id +"\">"+ data[i].cinemaName +"</option>\n";

            }
        }else if (option == 'screen'){
            for (var i = 0;i < data.length;++i){

                str = str + "<option value=\""+ data[i].id +"\">"+ data[i].screeningHallName +"</option>\n";

            }
        }else if (option == 'task'){ // 任务
            str = str + "<option value=\"\">请选择一种任务</option>\n";
            for (var i = 0;i < data.length;++i){

                str = str + "<option value=\""+ data[i].typeId +"\">"+ data[i].taskName +"</option>\n";

            }
        }else{ // language
            for (var i = 0;i < data.length;++i){

                str = str + "<option value=\""+ data[i].key +"\">"+ data[i].value +"</option>\n";

            }
        }
        $("#"+selector).append(str);


}


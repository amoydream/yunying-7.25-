$(function (ev) {
    $(ev.currentTarget).text("正在获取位置......");
    //创建百度地图控件
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() === BMAP_STATUS_SUCCESS) {
            //以指定的经度与纬度创建一个坐标点
            let pt = new BMap.Point(r.point.lng, r.point.lat);
            //创建一个地理位置解析器
            let geoc = new BMap.Geocoder();
            geoc.getLocation(pt, function (rs) {//解析格式：城市，区县，街道
                // let addComp = rs.addressComponents;
                // console.log(rs);
                $(".head .address").text(rs.address)
            });
        }
        else {
            $(ev.currentTarget).text('定位失败');
        }
    }, {enableHighAccuracy: true})//指示浏览器获取高精度的位置，默认false
});

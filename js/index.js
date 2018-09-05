$(function () {
    // 获取unionCode
    var unionCode = getUrlParms('unionCode');
    console.log(unionCode);

    if (unionCode === null || unionCode === 'null' || unionCode === '' || unionCode === undefined) {
        window.location.href = 'no-unionCode.html';
    }

    // var unionCode = "7c51a5d3529b44629a4835658bbbb4de";


    // 获取openid
    console.log(getUrlParms('loginCode'));
    if (getUrlParms('loginCode') === null || getUrlParms('loginCode') === '' || getUrlParms('loginCode') === undefined) {
        if (getGlobalVal('loginCode') === null || getGlobalVal('loginCode') === 'null' || getGlobalVal('loginCode') === undefined || getGlobalVal('loginCode') === '') {
            window.location.href = ip + "/customer/getLoginCode?ownUrl=" + encodeURIComponent(ownUrl) + "&unionCode=" + unionCode;
        } else {
            $('.container').show();
        }

    } else {
        setGlobalVal('loginCode', getUrlParms("loginCode"));
        $('.container').show();
    }



    // 商品列表
    $.ajax({
        url: ip + "/goods/list",
        type: "GET",
        dataType: "json",
        data: {
            unionCode: unionCode
        },
        jsonp: "callback",
        jsonpCallback: "success_jsonpCallback",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.withCredentials = true;
        },
        success: function (res) {
            if (res.code === 0) {
                setGlobalVal('deviceId', res.data.deviceInfo.id);
                var html = template("goodsList", {data: res.data.goodsInfo});
                $(".product").html(html)
            } else {
                alert(res.msg)
            }
        },
    });


    $(".head .right").on("click", function () {
        $(".handle").toggleClass("show");
    });

    // 遍历商品分类
    $(".class>div").each(function (index) {
        $(".class>div").eq(index).click(function () {
            $(this).addClass("active").siblings().removeClass("active");
            if (index === 0) {
                console.log(0);
            } else if (index === 1) {
                console.log(1);
            } else if (index === 2) {
                console.log(2);
            }
        });
    });
});
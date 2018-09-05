var payDate;
$(function () {
    // 定义一些变量
    var product = {
        price: getUrlParms("price"),
        number: $(".choose .num"),
        productId: getUrlParms("productId"),
        cost: '',
        discount: "",
        prices: "",
        orderId: ""
    };
    // 拿到商品详情
    $.ajax({
        url: ip + "/goods/detail",
        type: "GET",
        dataType: "json",
        data: {
            id: product.productId
        },
        async: false,
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
                console.log(res.data);
                product.cost = res.data.goods.cost;
                product.discount = res.data.goods.discount;
                product.prices = res.data.goods.price;
                $(".head .name").html(res.data.goods.name);
                $(".detail .product-photo img").attr("src", ip + res.data.goods.img);
                $(".detail .price span").html(res.data.goods.discount);
                $(".detail .product-label").html(res.data.goodsLabel.name);
                $(".advertising img").attr("src", ip + res.data.goodsImage[0].image);
            } else {
                alert(res.msg)
            }
        },
    });


    $(".check span").html("￥" + product.price);  //将价格拿到渲染到文件中

    // 调出消费记录页面
    $(".head .right").on("click", function () {
        $(".handle").toggleClass("show");
    });


    $(".buy").on("click", function () {
        $.ajax({
            url: ip + "/order/createOrder?loginCode=" + getGlobalVal('loginCode'),
            type: "POST",
            dataType: "json",
            data: {
                deviceId: getGlobalVal('deviceId'),
                goodsId: product.productId,
                goodsNum: 1,
                cost: product.cost,
                price: product.prices,
                discount: product.discount,
            },
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
            },
            success: function (res) {
                if (res.code === 0) {
                    payDate = res.data;
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    }
                }
            },
        });
    });


    function onBridgeReady() {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
            "appId": payDate.appId, //公众号名称，由商户传入
            "timeStamp": payDate.timeStamp, //时间戳，自1970年以来的秒数
            "nonceStr": payDate.nonceStr, //随机串
            "package": payDate.package,
            "signType": payDate.signType, //微信签名方式：
            "paySign": payDate.paySign //微信签名
        }, function (res) {
            alert(JSON.stringify(res));
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                alert("支付成功！");
                window.location.href = "shipment.html"
            } else {
                alert("支付失败！");
            }
        });
    }


    // 抽奖
    $('.draw').on("click",function () {
        window.location.href='draw.html?productId='+product.productId;
    })
});
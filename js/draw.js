$(function () {
    // 拿到到要抽奖的商品信息
    var product = {
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
                $(".box product").attr("src", ip + res.data.goods.img)
            } else {
                alert(res.msg)
            }
        },
    });


    let count1 = -500, count2 = -500, count3 = -500;
    let s1 = 0, s2 = 0, s3 = 0;
    let flag = true;
    $("button").on("click", function () {
        if (flag) {
            flag = false;
            // 支付接口
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
                    isLuckOrder: 1
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
                        console.log(res);
                        alert("1");
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
                    } else {
                        alert(res)
                    }
                },
            });
        }
    });

    // 动画
    function cartoon(a, b, c) {
        let timer1 = setInterval(function () {
            count1 = count1 + 4;
            s1++;
            $(".box .one ul").css("transform", "translateY(" + count1 + "px)");
            if (count1 === 0) {
                count1 = -500;
                $(".box .one ul").css("transform", "translateY(0px)");
            }
            if (s1 === (500 + a * 50)) {
                s1 = 0;
                clearInterval(timer1);
                count1 = -500;
            }
        }, 1);

        let timer2 = setInterval(function () {
            count2 = count2 + 4;
            s2++;
            $(".box .two ul").css("transform", "translateY(" + count2 + "px)");
            if (count2 === 0) {
                count2 = -500;
                $(".box .two ul").css("transform", "translateY(0px)");
            }
            if (s2 === (500 + b * 50)) {
                s2 = 0;
                clearInterval(timer2);
                count2 = -500;
            }
        }, 1);

        let timer3 = setInterval(function () {
            count3 = count3 + 4;
            s3++;
            $(".box .three ul").css("transform", "translateY(" + count3 + "px)");
            if (count3 === 0) {
                count3 = -500;
                $(".box .three ul").css("transform", "translateY(0px)");
            }
            if (s3 === (500 + c * 50)) {
                s3 = 0;
                clearInterval(timer3);
                flag = true;
                count3 = -500
            }
        }, 1)
    }


    // 支付
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
                $.ajax({
                    url: ip + "/luckDraw/getResult",
                    type: "POST",
                    dataType: "json",
                    data: {
                        luckDrawId: payDate.luckDrawId,
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
                            let array = [0, 5, 10];
                            cartoon(array[0], array[1], array[2])
                        } else {
                            let array = [];
                            for (let i = 0; i < 3; i++) {
                                array[i] = Math.floor(Math.random() * 10 + 1);
                            }
                            console.log(array);
                            for (let i = 0; i < array.length; i++) {
                                if ((array[i] - array[i + 1]) % 5 === 0) {
                                    array[i] = array[i] + 1
                                }
                            }
                            array.sort(function (a, b) {
                                return a - b;
                            });
                            cartoon(array[0], array[1], array[2])
                        }
                    },
                });
            } else {
                alert("支付失败！");
            }
        });
    }

});
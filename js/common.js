var ip = 'https://www.cnnop.cn/customer';
var ownUrl='https://www.cnnop.cn/index.html';
// 获取地址栏参数，name:参数名称
function getUrlParms(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

//判断ajax返回的状态
function getCode(code) {

}


//获取code
function getLoginUserCode() {
    return $.cookie("code");
}

//设置全局参数
function setGlobalVal(key, value) {
    if (value == null) {
        $.cookie(key, value, {path: '/'});
    } else if (value instanceof Object) {
        $.cookie(key, JSON.stringify(value), {path: '/'});
    } else {
        $.cookie(key, value, {path: '/'});
    }
}

//获取全局参数
function getGlobalVal(key) {
    return $.cookie(key);
}

//获取全局参数
function getGlobalValNotNull(key) {
    var val = $.cookie(key);
    if (val == null || val === "null") {
        return "";
    } else {
        return val;
    }
}


function getloginCode() {
    // 获取loginCode
    $.ajax({
        url: ip + "/customer/getLoginCode",
        type: "POST",
        dataType: "json",
        jsonp: "callback",
        jsonpCallback: "success_jsonpCallback",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.withCredentials = true;
        },
        success: function (data) {
            console.log(data);
            setGlobalVal('loginCode', data.data.loginCode)
        },
    });
}




$(function () {
    $.ajax({
        url: ip + "/order/selectOrder?loginCode=" + getGlobalVal('loginCode'),
        type: "GET",
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
        success: function (res) {
            console.log(res.data);
            var html = template("record", {data: res.data});
            $(".consumption_body").html(html);
        }
    })
});
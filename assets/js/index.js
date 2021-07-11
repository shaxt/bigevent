$(function() {
    getUserInfo();

    var layer = layui.layer;
    $("#btnLoginOut").on("click", function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //删除本地储存的token
            localStorage.removeItem("token");
            //跳转到login页面
            location.href = "/login.html";
            layer.close(index);
        });
    })
});

function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        /* headers: {
            Authorization: localStorage.getItem("token") || '',
        }, */
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取信息失败");
            }
            console.log(res);
            renderAvatar(res.data);
        },
        // complete: function(res) {
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
        //         //清除token
        //         localStorage.removeItem("token");
        //         location.href = '/login.html';
        //     }
        // }
    });
}

//渲染用户头像函数
function renderAvatar(user) {
    //渲染用户昵称
    var username = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp&nbsp" + username);
    //渲染用户头像
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text_avatar").hide();
    } else {
        $(".layui-nav-img").hide();
        var first = username[0].toUpperCase();
        $(".text_avatar").html(first).show();
    }
}
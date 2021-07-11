$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度必须在1~6个字符之间"
            }
        }
    });
    initUserInfo();
    //获取用户数据的函数
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //渲染数据
                form.val("formUserInfo", res.data);
            }
        })
    }

    $("#btnRest").on("click", function(e) {
        e.preventDefault();
        initUserInfo();
    });

    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败");
                }
                layer.msg("更新用户信息成功");
                //调用父页面中的方法 重新渲染用户信息和头像
                window.parent.getUserInfo();
            }
        })
    })
})
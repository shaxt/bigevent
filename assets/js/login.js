$(function() {
    $("#link_reg").on("click", function() {
        $(".reg-box").show();
        $(".login-box").hide();
    });
    $("#link_login").on("click", function() {
        $(".reg-box").hide();
        $(".login-box").show();
    });
    //给表单做预验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,16}$/, "密码必须是6-16位，切不能出现空格"],
        //校验两次密码是否一致的规则
        repwd: function(value) {
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return "两次密码不一致";
            }
        }
    });

    $('#form_reg').on('submit', function(e) {
        // 1. 阻止默认的提交行为
        e.preventDefault();
        // 2. 发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.post('/api/reguser', data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("注册成功，请登录");
                $("#link_login").click();

            });
    });

    //监听登录表单的提交事件
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("登录失败");
                }
                localStorage.setItem("token", res.token);
                layer.msg("登录成功");
                location.href = "/index.html";
            }
        })
    })
})
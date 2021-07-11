$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    var layer = layui.layer;
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    $("#btnChooseImg").on("click", function() {
        $("#file").click();
    });

    $("#file").on("change", function(e) {
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg("请选择照片");
        }

        //拿到用户选择的照片
        var file = filelist[0];
        console.log(file);

        //将文件，转换成路径
        var imgURL = URL.createObjectURL(file);

        //重新初始化裁剪区域

        $image.cropper("destroy").attr("src", imgURL).cropper(options);
    });

    $("#updateAvatar").on("click", function() {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL,
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新头像失败");
                }

                layer.msg("更新头像成功");
                window.parent.getUserInfo();
            }
        })
    })
})
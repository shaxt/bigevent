$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            }
        })
    }

    var indexAdd = null;
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $("#dialog-add").html(),
            area: ["500px", "250px"],
        });
    });

    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("新增分类失败");
                }
                initArtCateList();
                layer.msg("新增分类成功");
                layer.close(indexAdd);
            }
        })
    });

    //编辑分类
    var indexEdit = null;
    $("tbody").on("click", ".btnEdit", function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $("#dialog-edit").html(),
            area: ["500px", "250px"],
        });
        var id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                form.val('form-edit', res.data)

            }
        })
    });

    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg(res.message);
                }

                initArtCateList();
                layer.msg("更新数据成功");
                layer.close(indexEdit);
            }
        })
    });

    $("tbody").on("click", ".btnDelete", function() {
        var id = $(this).attr("data-id");
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章分类失败");
                    }
                    initArtCateList();
                    layer.msg("删除文章分类成功");
                }
            })
            layer.close(index);
        });
    })


})
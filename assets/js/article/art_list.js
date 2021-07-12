$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: ""
    }

    initTable();
    //获取列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败");
                }
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ":" + mm + ":" + ss;
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }

    //渲染文章分类的下拉选择框
    initCate();

    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败")
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        q.cate_id = $("[name=cate_id]").val();
        q.state = $("[name=state]").val();
        initTable();
    });

    //渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }

    $("tbody").on("click", ".btn-delete", function() {
        var len = $(".btn-delete").length;
        var id = $(this).attr("data-id");
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败");
                    }
                    layer.msg("删除文章成功");
                    if (len == 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})
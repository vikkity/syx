$(function (){
    const form= layui.form
    const laypage= layui.laypage
    const q={
           pagenum: 1, // 页码值，默认请求第一页的数据
           pagesize: 2, // 每页显示几条数据，默认每页显示2条
           cate_id: "", // 文章分类的 Id
           state: "", // 文章的发布状态
    };
    const initTable=()=>{
        $.ajax({
            type: "GET", 
            url: "/my/article/list",
            data:q,
            success: (res)=> {
                console.log(res);
                if (res.status !== 0) return layer.msg("获取文章列表失败！")
                 // 使用模板引擎渲染页面的数据
                const htmlStr= template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    

       // 初始化文章分类的方法
       const initCate = () => {
           $.ajax({
               type: 'GET',
               url: "/my/article/cates",
               success: (res) => {
                   //  console.log(res);
                   if (res.status !== 0) return layer.msg("获取分类数据失败！")
                   const htmlStr = template('tpl-cate', res)
                   $('[name = "cate_id"]').html(htmlStr)
                   form.render()
               }
           })
       }
       //实现筛选的功能
       $('#form-search').submit(function (e) {
           e.preventDefault()
           // 获取表单中选中项的值
           q.cate_id = $('[name="cate_id"]').val()
           q.state = $('[ name="state"]').val()
           console.log(q);
           initTable()
       })

       // 定义渲染分页的方法
       function renderPage(total) {
           // 调用 laypage.render() 方法来渲染分页的结构
           laypage.render({
               elem: 'pageBox', // 分页容器的 Id
               count: total, // 总数据条数
               limit: q.pagesize, // 每页显示几条数据
               curr: q.pagenum, // 设置默认被选中的分页
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                    limits: [2, 3, 5, 10],
               jump:(obj,first) => {
                   console.log(first);
                   q.pagenum=obj.curr
                   q.pagesize=obj.limit
                   if(!first) {
                       initTable()
                   }
               }
           })
       }


       $('tbody').on('click','.btn-delete',function() {
           const len=$('.btn-delete').length
           const id = $(this).attr('data-id');
           layer.confirm('确认删除?', {
               icon: 3,
               title: '提示'
           }, function(index) {
               $.ajax({
                   type:'GET',
                   url: '/my/article/delete/' + id,
                   success: (res) => {
                       if (res.status !== 0) return layer.msg('文章删除失败！')
                       layer.msg('文章删除成功！')
                       if(len===1){
                           q.pagenum=q.pagenum===1 ? 1 : q.pagenum-1
                       }
                       initTable()
                       layer.close(index)
                   }
               })
              
           })
       })




    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

 
initTable()
initCate()
   
})
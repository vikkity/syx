function getUserInfo(){
    $.ajax({
        type: "GET",
        url:"/my/userinfo",
        // headers: {
            // Authorization: localStorage.getItem("token"),
        // },
        success: (res) => {
            console.log(res);
            if(res.status  !==0)return layer.msg("获取信息失败")
            layer.msg("获取信息成功")
            renderAvatar(res.data)
        }
    })
}

const renderAvatar =(user)=>{
     // 获取用户名字
     let name = user.nickname || user.username
      // 设置欢迎文本
      $('#welcome').html(`欢迎${name}`)
       // 按需渲染用户头像
       if(user.user_pic != null){
             // 渲染图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
       }else {
           $('.layui-nav-img').hide()
           let firstName = name[0].toUpperCase();
           $(".text-avatar").html(firstName);
       }
}

//退出功能
$('#btnlogout').click(()=> {
    layer.confirm('是否退出？',{ icon: 3, title: "" }, function (index) {
        // 清空本地存储里面的 token
        localStorage.removeItem("token");
        // 重新跳转到登录页面
        location.href = "/login.html";
    })
})

getUserInfo()

function change(){
    $('#change').attr('class','layui-this').next().attr('class','')
}
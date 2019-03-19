# 小程序插件报到功能接入文档#
 ### 在小程序后台添加插件 
登录自己的小程序管理后台: https://mp.weixin.qq.com ， 小程序开发者可在小程序管理后台-设置-第三方服务-插件管理中，根据AppID或者插件名称查找需要的插件，并申请使用。插件开发者在24小时内通过后，小程序开发者可在小程序内使用该插件。
 ### 接入使用插件
微信小程序官方插件使用文档参考：https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html

 ### 引入插件代码包
对于插件的使用者，使用插件前要在app.json中声明需要使用的插件，例如：



      {
        "plugins": {
          "ipsPlugin": {
            "version": "1.0.5",
            "provider": "wx937a3ada5c7e0616"
          }
        }
      }

  ###  使用插件的 js 接口
        var plugin = requirePlugin("myPlugin");
      
        方法为:plugin.setuserinfo(object)   //必须传用户信息 object

        点击进入查询页前需自行调用微信扫一扫，把扫描二维码结果带在跳转链接后。
        url格式为:   (code必须 encodeURIComponent下)
        "plugin-private://wx937a3ada5c7e0616/pages/scanCodeResulte/scanCodeResulte?url="+code

        let url={
                producturl:"/pages/detail/detail",
                indexurl:"/pages/index/index",
            }

        plugin.setUrl(url);  //传入详情地址和主页地址

        跳转历史查询页地址
        wx.navigateTo({
            url: "plugin-private://wx937a3ada5c7e0616/pages/record/record"
        })





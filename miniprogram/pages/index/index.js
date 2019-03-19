var plugin = requirePlugin("myPlugin")
Page({
  data:{
    
  },
  onLoad: function() {
    this.demofun();
    plugin.initCallBack(res => {
      console.log(res);
    })

    //传用户信息 object   b11be94e86c6f9f7bfe3c3d9beccd265
    plugin.setuserinfo({
      "uid": "",
      "rid": "o9zOyuL7N5ExIDIiklF3MKg37oM4",
      "openid": "oV8IZ0V_8tMJI0dPXizt2wBkYI7Q",
      "nickname": "Dark",
      "avatar": "https://static.dreamlive.net/images/a9f70d6a4979fbb31ac01342341d4efa.png",
      "gender": "F",
      "phone": "18611633480",
      "location": "",
      "source": "zhongzhui",
      "platform": "wx",
      "addtime": "2018-07-28 17:19:39",
      "modtime": "2018-07-28 17:19:39",
      "appid": "",
      "token": "",
      "appid":"wx957d42f9547c25b1",
      "cardId":"ccss"
    });
    let url={
      producturl:"/pages/product_detail/product_detail",
      indexurl:"/pages/tab/tab",
      productlist:"/pages/tab/tab",
      otherappindex:"pages/load/load"
    }
    plugin.setUrl(url);

  },
  onShow:function(){
    
  },

  
  _gotoToShop(){
    let shopcode = "https://xfd.cpzs.org/p/518114868868427776/1100000000045371"
    let code = encodeURIComponent(shopcode);
    plugin.getCodeType(code,function(res){
      if (res.isShop && res.Flag) {
        // console.log("店铺码")
        
      } else if (!res.isShop && res.Flag){
        //console.log("店铺码")
        wx.navigateTo({
          url: "plugin-private://wx937a3ada5c7e0616/pages/scanCodeResulte/scanCodeResulte?url=" + code
        })
      }else{
        //不是有效的中追二维码
      }
    })
    
  },
  _gotoToShops(){
    
    let shopscode = "http://xfdt.cpzs.org/s/518114868868427776"
    let code = encodeURIComponent(shopscode);
    plugin.getCodeType(code,function(res){
      if (res.isShop && res.Flag){
        // console.log("店铺码")
        wx.navigateTo({
          url: "plugin-private://wx937a3ada5c7e0616/pages/scanToShops/scanToShops?url=" + code
        })
      } else if (!res.isShop && res.Flag){
        //console.log("商品码")
        
        
      }else{
         //不是有效的中追二维码
      }
    })
  },
  _gotoToRecode(){
    wx.navigateTo({
      url: "plugin-private://wx937a3ada5c7e0616/pages/record/record"
    })
  },
  demofun(){

  },
  
})
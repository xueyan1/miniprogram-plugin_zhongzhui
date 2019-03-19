// rootviews/pages/scanCodeResulte/scanCodeResulte.js
const P = require('../../src/js/lib/wxpage')
const appcommon = require("../../src/js/service/appcommon.js");
import Scratch from "../../template/scratch/scratch.js";
const app = require("../../src/js/index.js");
const index=require("../../index.js");

P( Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    scaninfo:null, //码信息
    iserror:false,//是否是错误
    isiphoneX:false ,//是否是iPhone X
    openQuery:null, //打开页面的query
    isgolocal:false,//打开定位弹窗,
    userinfo: null,
    otherappindex: "", //跳转其他小程序首页
    isshowqrcodewapper:false,
    isneedsaveimgshouquan: false,//是否需要弹出去授权
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("---onLoad---")
    console.log("options:", options)
    console.log("app.DataCenter:", app.DataCenter)
    console.log("---onLoad---")
    let _otherappindex = app.DataCenter.jumpUrl.otherappindex ;
    let opt = decodeURIComponent(options.url);
    this._initShareData();
    this.setData({
      openQuery: opt,
      userinfo: app.DataCenter.appUserInfo,
      otherappindex: _otherappindex
    })
    this._initSysteminfo();//获取设备信息
    this.$on(app.event.getloac, res => {
      let wxlocal = app.wxApi.wxLocation();
      this.setData({
        isgolocal: false
      })

      wxlocal().then(res => {
        this._checkCode(res)
      })
    })
    this._getUserLocal(res => {
      this._checkCode(res)
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true,
    })
    this._shujushangbao();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  _initSysteminfo(){
    if (!app.DataCenter.appSystemInfo) {
      app.SAppConfig.checkSystemInfo().then(res=>{
        app.DataCenter.appSystemInfo = res;
        this._checkisIphoneX();
      })
    }else{
      this._checkisIphoneX();
    }
  },
  
  //监测是否是iphonex
  _checkisIphoneX(){
    this.setData({
      isiphoneX: app.utils.checkIsIphoneX(app.DataCenter.appSystemInfo)
    })
  },
  //验证码
  _checkCode(_res){
    this.setData({
      iserror:false
    })

    app.AppScan.upDateQrCode(this.data.openQuery).then(res=>{
      if (res.Flag){
        if (!res.isShop) {
          //商品

          let gotopath = "../scanCodeResulte/scanCodeResulte?url=" + encodeURIComponent(this.data.openQuery);
          this.$redirect(gotopath);
        } else {
          this._getCodeData(_res)
        }
      }else{
        this.setData({
          iserror: true
        })
      }
    },error=>{
  
      this.setData({
        iserror: true
      })
    
    })
  },
  //获取地理位置
  _getUserLocal(_fun){
    let wxlocal = app.wxApi.wxLocation();
    wxlocal().then(res => {
      _fun(res);
    }, error => {
        this.setData({
          isgolocal: true,
        })
    })
  },
  //查询结果
  _getCodeData(res){
    let _uid,_jwd;
    if (app.DataCenter.appUserInfo && app.DataCenter.appUserInfo["uid"]){
      _uid = app.DataCenter.appUserInfo.uid;
    }else{
      _uid = ""
    }
    if (res.errMsg == "getLocation:ok") {
      _jwd = res.latitude + "," + res.longitude
    }else{
      _jwd = ""
    }
    app.AppScan.getQrCodeData({ uid: _uid, jwd: _jwd}).then(res=>{

       console.log(res)

      this.setData({
        scaninfo:res
        // codestring: app.utils.replaceStr(res.Data.Info.label_id)
      })
      // this._getscratch();
    },error=>{
      //回首页
      this.setData({
        iserror: true
      })
    })
  },
  //扫码按钮
  _openScan() {
    let scancode = app.wxApi.wxScanCode();
    scancode().then(res => {
    
      if (res.scanType == "QR_CODE") {
        //this._checkCode(res.result)
        this.setData({
          openQuery: res.result
        })
        let wxlocal = app.wxApi.wxLocation();
       
        wxlocal().then(res => {
          this._checkCode(res)
        })
      }else{
        wx.showToast({
          icon: "none",
          title: "暂不支持该码"
        })
      }
    
    },error=>{
  
    })
  },
  //回首页
  _gotoMain(){
    let _url = app.DataCenter.jumpUrl.indexurl + "?cardId=" + app.DataCenter.appUserInfo.cardId
    wx.redirectTo({
      url: _url
    })
  },
  //去商城首页
  _gotoshops() {
    let _url = app.DataCenter.jumpUrl.productlist + "?nav_footer_active=1&cardId=" + app.DataCenter.appUserInfo.cardId;
    wx.redirectTo({
      url: _url
    })
  },
  //初始化分享内容数据
  _initShareData() {
    app.SAppConfig.getShareData().then(res => {
      app.SAppConfig.sharedata = res.data.sharedata;
    })
  },

  //去授权
  openSettingeventLoacl(e) {
 
    let wxlocal = app.wxApi.wxLocation();
    let that = this;
 
    if (e.detail.authSetting['scope.userLocation'] != undefined && e.detail.authSetting['scope.userLocation'] == true) {
 
      wxlocal().then(res => {
      
        this._getloc();
        
      })
  
    } else if (e.detail.authSetting['scope.userLocation'] != undefined && e.detail.authSetting['scope.userLocation'] != true) {
      wx.showToast({
        icon: "none",
        title: "勾选:地理位置"
      })
    } else if (e.detail.authSetting['scope.userLocation'] && e.detail.authSetting['scope.userInfo']) {
  
    }
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (e) {
    let _this = this;
    let sharetitle = "你好，我发现" + this.data.scaninfo.Data.Company.company_desc.companyName+"有很多好物，快来看看吧~";
    let idx = Math.floor((Math.random() * app.SAppConfig.sharedata.length));
    let _path = `/pages/tabbar/card/card?cardId=${app.DataCenter.appUserInfo.cardId}&nav_footer_active=1`;
    console.log("---onShareAppMessage---")
    console.log("_path:", _path)
    console.log("---onShareAppMessage---")
    return {
      title: sharetitle,
      path: _path,
      imageUrl: app.SAppConfig.sharedata[idx].img,
      success: (res) => {
        app.SAppConfig.checkSystemInfo().then(d => {
          if (d.platform == 'android') {
            app.wxApi.wxGetShareInfo(res.shareTickets).then(res => {
              //console.log("android--分享到群了")
           
            }, error => {
              //console.log("android--分享到个人")
             
            })
          } else if (d.platform == 'ios') {
            if (res.shareTickets != undefined) {
              app.wxApi.wxGetShareInfo(res.shareTickets).then(res => {
                //console.log("ios--分享到群了")
          
              })
            } else {
              //console.log('ios--分享到个人')
         
            }
          }
        })
      }
    }
  },
  _getloc(){

    this.$emit(app.event.getloac);
    this.setData({
      isgolocal: false
    })
  },
  _shujushangbao() {
    app.SAppConfig.sendUserInfo(app.DataCenter.appUserInfo)
  },
  _showqrcode() {
    // console.log("123123")
    this.setData({
      isshowqrcodewapper: true
    })
  },
  _closeqrcode() {
    this.setData({
      isshowqrcodewapper: false
    })
  },
  _saveqrcode() {
    let that = this;
    wx.getImageInfo({
      src: that.data.scaninfo.Data.QrCode,
      success: function (res) {
        //console.log(res.path)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(result) {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail(){
            that.setData({
              isneedsaveimgshouquan: true
            })

            wx.showToast({
              title: '保存图片失败',
              icon: 'none',
              duration: 2000
            })
          }
        })

      },
      fail(){
        wx.showToast({
          title: '拉取图片失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  _openimg(){
    wx.previewImage({
      urls: [this.data.scaninfo.Data.QrCode],
      current: this.data.scaninfo.Data.QrCode
    })
  },
  
  openSettingevent() {
 
    this.setData({
      isneedsaveimgshouquan: false
    })
  },
}))
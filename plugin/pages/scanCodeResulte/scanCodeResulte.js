// rootviews/pages/scanCodeResulte/scanCodeResulte.js
const P = require('../../src/js/lib/wxpage')
const appcommon = require("../../src/js/service/appcommon.js");
import Scratch from "../../template/scratch/scratch.js";
const app = require("../../src/js/index.js");
const index=require("../../index.js");
// const app = getApp();

P( Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    scaninfo:null, //码信息
    codestring:"", //分隔的验证码 为了显示
    isFocus: false, //是否是输入状态
    inputValue:"",//输入验证码
    isshowinputcodebtn:true,//是否显示属于验证按钮
    codeisok:true,//输入的验证码是否验证成功
    iserror:false,//是否是错误
    istouchinputcode:false,//是否点击输入验证码
    isiphoneX:false ,//是否是iPhone X
    openQuery:null, //打开页面的query
    isgolocal:false,//打开定位弹窗,
    userinfo:null,
    gotoproductpath:"",//到商品详细地址
    otherappindex:"" ,//跳转其他小程序首页
    isshowqrcodewapper:false,  //是否显示二维码的界面
    ismorevleft:false,
    isneedsaveimgshouquan:false,//是否需要弹出去授权
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("---onLoad---")
    console.log("options:", options)
    console.log("app.DataCenter:", app.DataCenter)
    console.log("---onLoad---")
    let _otherappindex = app.DataCenter.jumpUrl.otherappindex;
    let opt = decodeURIComponent(options.url);
    this.setData({
      openQuery: opt,
      userinfo: app.DataCenter.appUserInfo,
      otherappindex: _otherappindex
    })
    //this._initData();
    //this._upDataCodeData(); //二维码信息
    this._initSysteminfo();//获取设备信息
    this._initShareData(); //获取分享数据
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
        if (res.isShop){
          //商品
          let gotopath = "../scanToShops/scanToShops?url=" + encodeURIComponent(this.data.openQuery);
          this.$redirect(gotopath);
        }else{
          this._getCodeData(_res)
        }
        
      }else{
        let obj = {};
        this.setData({
          iserror: true,
          scaninfo: obj
        })
      }
    },error=>{
      let obj = {};
      this.setData({
        iserror: true,
        scaninfo: obj
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

      // console.log(res)
      let _gotoproductpath = app.DataCenter.jumpUrl.producturl + `?productId=${res.Data.Product.product_desc.productId}&cardId=${app.DataCenter.appUserInfo.cardId}`
      if (this.data.userinfo.appid != res.Data.Company.company_desc.appid){
        _gotoproductpath = app.DataCenter.jumpUrl.otherappindex
      }
      this.setData({
        scaninfo:res,
        codestring: app.utils.replaceStr(res.Data.Info.label_id),
        gotoproductpath: _gotoproductpath
      })
      this._getscratch();
    },error=>{
      //回首页
      this.setData({
        iserror: true
      })
    })
  },
  /**
   * 监听键盘输入
   */
  _listenKeyInput: function (e) {
    this.setData({
      codeisok: true
    })
    var text = e.detail.value;
    if(text.length>4){
      text = text.substring(0,4);
    }
    this.setData({
      inputValue: text
    })
    this._checkInputYzmIsOk();
  },
  //监测输入的验证码是否有效
  _checkInputYzmIsOk(){
    if (this.data.inputValue.length != 4){
      return;
    }
    if (this.data.inputValue != this.data.scaninfo.Data.Info.cons_code){
      //验证码输入错误
      wx.showToast({
        icon: "none",
        title: "您输入的验证码有误  请重新输入"
      })
      this.setData({
        codeisok:false
      })
      return;
    }else{
      
      this._verification();
    }
  },
  //验证
  _verification(){
    let local = app.wxApi.wxLocation();
  
    local().then(res=>{
      let uuidstr = app.utils.guuid()
      let obj = {
        id: this.data.scaninfo.Data.Info.label_id,
        token: app.utils.zz_md5(uuidstr),
        uid: app.DataCenter.appUserInfo.openid,
        jwd: res.latitude + "," + res.longitude,
        openid: app.DataCenter.appUserInfo.openid,
        unionid: app.DataCenter.appUserInfo.unionid,
        uuid: uuidstr
      }
     
      return app.AppScan.verification(obj)
    }).then(res => {
  
      this.setData({
        isFocus: false
      })
      if (res.errno == 0) {
        this.setData({
          scaninfo: app.AppScan.qrcodedata,
          tipiconisshow: false
        })
     
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
      return app.AppScan.addHistory(app.DataCenter.appUserInfo.uid, app.DataCenter.appUserInfo.token);
    }).then(res => {
    })
     
  },
  //输入验证码事件
  _inputYzmEvent(){
    if (!app.DataCenter.appUserInfo) {
      this.setData({
        istouchinputcode: true
      })
      return;
    }
    this.setData({
      isFocus:true,
      isshowinputcodebtn:false
    })
  },
  //跳转地图
  _gotoMap() {
    this.$route("../map/map");
  },
  //商品详情
  _gotoDetail() {
    let _url = this.data.gotoproductpath
    wx.redirectTo({
      url: _url
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
  _gotoshops(){
    let _url = app.DataCenter.jumpUrl.productlist + "?nav_footer_active=1&cardId=" + app.DataCenter.appUserInfo.cardId;
    wx.redirectTo({
      url: _url
    })
  },
  //刮开验证码前获取view的高宽
  _getscratch() {
    let w = app.DataCenter.appSystemInfo.screenWidth;
    let _width=w*0.374;
    let _height=w*0.1074;
   
    let that = this;
    if (!app.DataCenter.appUserInfo ||
      !("uid" in app.DataCenter.appUserInfo)) {

      that._getscratchres(_width, _height);
        return;
    }
      that._getscratchres(_width, _height);
  },
  //刮开验证码
  _getscratchres(width, height) {
    let that = this;
    wx.getImageInfo({
      src:"https://html5.dreamlive.net/wxapp/res/placeholder.png",
      success(res){
        console.log("wx.getImageInfo-success")
        console.log(res)
        that.scratch = new Scratch(that, {
          canvasWidth: width,
          canvasHeight: height,
          imageResource: res.path,
          maskColor: "red",
          r: 4,
          awardTxt: that.data.scaninfo.Data.Info.cons_code,
          awardTxtColor: "#3985ff",
          awardTxtFontSize: "24px",
          callback: () => {
            that._verification();
          }
        })
        that.scratch.restart();
      },
      fail(err){
        console.log("wx.getImageInfo-fail")
        console.log(err)
        that.scratch = new Scratch(that, {
          canvasWidth: width,
          canvasHeight: height,
          imageResource: '/src/images/placeholder.png',
          maskColor: "red",
          r: 4,
          awardTxt: that.data.scaninfo.Data.Info.cons_code,
          awardTxtColor: "#3985ff",
          awardTxtFontSize: "24px",
          callback: () => {
            that._verification();
          }
        })
        that.scratch.restart();
      }
    })
    
    
  },
 
  //初始化分享内容数据
  _initShareData() {
    app.SAppConfig.getShareData().then(res => {
      app.SAppConfig.sharedata = res.data.sharedata;
    })
  },

  //去授权
  openSettingeventLocal(e) {
    // console.log(e)
    let wxlocal = app.wxApi.wxLocation();
  
 
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
    let idx = Math.floor((Math.random() * app.SAppConfig.sharedata.length));
    // let sharetitle = "我在" + this.data.scaninfo.Data.Company.company_desc.companyName + "发现" + this.data.scaninfo.Data.Product.product_desc.productName+"，快来看看吧~";
    let _path = "";
    if (app.utils.ObjIsNull(this.data.scaninfo)){
      _path = `/pages/tabbar/card/card?cardId=${app.DataCenter.appUserInfo.cardId}&nav_footer_active=1`;
    }else{
      _path = app.DataCenter.jumpUrl.producturl + `?cardId=${app.DataCenter.appUserInfo.cardId}&productId=${this.data.scaninfo.Data.Product.product_id}`
    }
    console.log("---onShareAppMessage---")
    console.log("_path:", _path)
    console.log("---onShareAppMessage---")
    return {
      title: app.SAppConfig.sharedata[idx].txt,
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
  },
  _shujushangbao(){
    app.SAppConfig.sendUserInfo(app.DataCenter.appUserInfo)
  },
  _showqrcode(){
    this.setData({
      isshowqrcodewapper:true,
      ismorevleft:true
    })
  },
  _closeqrcode() {
    this.setData({
      isshowqrcodewapper: false,
      ismorevleft: false
    })
  },
  _saveqrcode(){
    let that = this;


    wx.getImageInfo({
      src: that.data.scaninfo.Data.QrCode,
      success: function (res) {
        //console.log(res.path)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(result) {
            //console.log(result)
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
  openSettingevent(){
    this.setData({
      isneedsaveimgshouquan: false
    })
  },
  _openimg() {
    wx.previewImage({
      urls: [this.data.scaninfo.Data.QrCode],
      current: this.data.scaninfo.Data.QrCode
    })
  }
}))
const P = require('../../src/js/lib/wxpage')
const app = require("../../src/js/index.js");
P('map', {
  data: {
    markers: [{
      iconPath: "/src/images/locationicon.jpg",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 22,
      height: 26
    }],
    screenHeight: 0, //设置地图高度
    screenWidth: 0, //设置地图宽度
    showinfo: {}, //显示的信息
  },
  onPageLaunch: function () {
    //console.log('[pages/index] 页面启动：', new Date() - d, 'ms')
  },
  onAppLaunch: function (opts) {
    //console.log('[pages/index]  程序启动：', opts)
  },
  onLoad: function (opts) {
    this.setData({
      screenHeight: app.DataCenter.appSystemInfo.windowHeight,
      screenWidth: app.DataCenter.appSystemInfo.screenWidth
    })
    if (app.utils.ObjIsNull(opts)) {
      this._initData();
    } else {
      this._queryInit(opts);
    }

  },
  regionchange(e) {

  },
  _queryInit(_obj) {
    let jwdarr = _obj.jwd.split(",");
    if (jwdarr.length == 2) {
      let _markers = [{
        iconPath: "/src/images/locationicon.jpg",
        id: 0,
        latitude: parseFloat(jwdarr[0]) + 0.0013,
        longitude: parseFloat(jwdarr[1]) + 0.0063,
        width: 22,
        height: 26
      }]

      let obj = {
        addr: _obj.detail,
        time: _obj.time
      }

      this.setData({
        showinfo: obj,
        markers: _markers
      })
    }
  },
  _initData() {
    let jwdarr = app.AppScan.qrcodedata.Data.Info.cons_jwd.split(",");
    if (jwdarr.length == 2) {
      let _markers = [{
        iconPath: "/src/images/locationicon.jpg",
        id: 0,
        latitude: parseFloat(jwdarr[0]) + 0.0013,
        longitude: parseFloat(jwdarr[1]) + 0.0063,
        width: 22,
        height: 26
      }]

      let obj = {
        addr: app.AppScan.qrcodedata.Data.Info.cons_addr,
        time: app.AppScan.qrcodedata.Data.Info.cons_time
      }

      this.setData({
        showinfo: obj,
        markers: _markers
      })
    }
  },
  onReady: function () {

  },
  onShow: function () {
    //console.log('[pages/index] 页面展示')
    wx.hideShareMenu()
  },
  onAwake: function (t) {
    //console.log('[pages/index] 程序被唤醒：', t)
  },



})
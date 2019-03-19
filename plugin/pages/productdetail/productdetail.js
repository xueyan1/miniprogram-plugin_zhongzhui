const P = require('../../src/js/lib/wxpage')
const appcommon = require('../../src/js/service/appcommon');
const app = require("../../src/js/index.js");
P('productdetail', {
  data: {
    scaninfo:null,
    isqiya:false
  },
  onPageLaunch: function () {
    //console.log('[pages/index] 页面启动：', new Date() - d, 'ms')
  },
  onAppLaunch: function (opts) {
    //console.log('[pages/index]  程序启动：', opts)
  },
  onLoad: function (opts) {

  },
  onReady: function () {
  },
  onShow: function () {
    //console.log('[pages/index] 页面展示')
    this.setData({
      scaninfo: app.AppScan.qrcodedata.Data
    })
    this._upIsQiYa();
    wx.hideShareMenu()
  },
  onAwake: function (t) {
    //console.log('[pages/index] 程序被唤醒：', t)
  },
  //是否是起亚
  _upIsQiYa(){
    if (this.data.scaninfo.Company.company_id == appcommon.companysid.qiya){
        this.setData({
          isqiya:true
        })
    }else{
      this.setData({
        isqiya: false
      })
    }
  }
})
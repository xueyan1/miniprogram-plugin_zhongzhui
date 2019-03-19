const P = require('../../src/js/lib/wxpage')
const shareinfo = require("../../src/js/shareinfo.js");
const app = require("../../src/js/index.js");
P({
  data: {
    
  },
  onPageLaunch: function () {
    //console.log('[pages/index] 页面启动：', new Date() - d, 'ms')
  },
  onAppLaunch: function (opts) {
    //console.log('[pages/index]  程序启动：', opts)
  },
  onLoad: function (opts) {
    //console.log('[pages/index] 页面已完成加载', opts)
    wx.showLoading({
      title: '数据加载中',
    })
    this._initData();
  },
  onReady: function () {
  },
  onShow: function () {
    //console.log('[pages/index] 页面展示')
    // this.setData({
    //   historydata: app.AppScan.scanhistorydata
    // })
    wx.hideShareMenu()
  },
  onAwake: function (t) {
    //console.log('[pages/index] 程序被唤醒：', t)
  },
  _gotomap(e){
    let obj = e.currentTarget.dataset.d;
    let str = "../map/map?detail=" + obj.pro_addr_detail + "&jwd=" + obj.pro_jwd + "&time=" + obj.pro_time;
    if (!app.DataCenter.appSystemInfo) {
     
      app.SAppConfig.checkSystemInfo().then(res => {
        app.DataCenter.appSystemInfo = res;
        this.$route(str)
      })
    }else{
      this.$route(str);
    }
  },
  _initData(){
      let uuidstr = app.utils.guuid()
      let obj = {
        uid: app.DataCenter.appUserInfo.openid,
        token: app.utils.zz_md5(uuidstr),
        uuid: uuidstr
      }
      app.AppScan.scanhistory(obj).then(res => {
        this.setData({
          historydata: app.AppScan.scanhistorydata
        })
        wx.hideLoading();
      })

  },
  
})
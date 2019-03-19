const wxRequest = require("../lib/wxRequest.js");
const wxApi = require("../lib/wxApi.js");
const appcommon = require("./appcommon.js");
const imgurl = "http://static.tongyigg.com";
const util = require("../util.js");
class sAppConfig{
  constructor() {
    this.gotoCompInfoData=[] //跳转企业小程序所需的数据
    this.sharedata=[];//分享文案数据
    this.companyinfo = {};//企业信息
    this.activityinfo = {};//活动信息
  }
 
  //获取分享内容数据
  getShareData() {
    return new Promise((resolve, reject) => {
      wxRequest.getRequest("shareData").then(res => {
        resolve(res);
      })
    })
  }
  //发送数据
  sendUserInfo(_obj){
    let obj = Object.assign(_obj, appcommon.getCommonParams())
    obj.invalid = ""
    return new Promise((resolve, reject) => {
      wxRequest.getRequest("usersync", obj).then(res => {
        // let data = JSON.parse(res.data.data.value);
        resolve(res);
      })
    })
  }

  //监测获取用户设备信息
  checkSystemInfo(){
    return new Promise((resolve, reject) => {
      let getSysinfo = wxApi.wxGetSystemInfo();
      getSysinfo().then(res=>{
        resolve(res);
      },error=>{
        reject(error);
      })
    })
  }
  //活动分享文案
  getShareCopywriting(){
    let obj = {
      "key": "sharedata"
    }
    obj = Object.assign(obj, appcommon.getCommonParams())
    return this._getConfiData(obj)
  }
  //获取中追后台配置的内容
  _getConfiData(_obj) {
    return new Promise((resolve, reject) => {
      wxRequest.getRequest("configinfo", _obj).then(res => {
        let data = JSON.parse(res.data.data.value);
        resolve(data);
      })
    })
  }

}

module.exports = sAppConfig;
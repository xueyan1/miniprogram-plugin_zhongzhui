const url = "https://xfd.cpzs.org";
const apiurl = "https://zhongzhui.dreamlive.net";
const logurl = "https://zhongzhuilog.dreamlive.net";
const html5url = "https://html5.dreamlive.net";

const interfaceurl = {
  scanCode: url + "/api/getInformation", //依据追溯码查询相关信息
  getCompany: url +"/api/getCompany",//获得企业信息
  getRecord: url + "/api/getRecord",  //查询扫码记录接口
  getCodeType: url + "/api/getCodeType",//判断是否是本小程序
  zz_interfacest: url + "/interface/status",//中追码状态
  verification: url + "/api/verification", //验证 追溯接口 次数
  miniAppSession: apiurl + "/user/miniAppSession", //获取微信登录openid
  miniAppActive: apiurl + "/user/miniAppActive", //微信登录
  uploadImage: apiurl + "/upload/uploadImage",//上传图片
  addHistory: apiurl + "/History/addHistory", //添加扫码记录
  getShareNum: apiurl + "/share/getShareNum", //获得分享次数
  addShareNum: apiurl + "/share/addShareNum", //添加分享次数
  shareData: html5url + "/wxapp/zhongzhuishare.php", //分享文案
  postuserinfo: apiurl + "/user/loginLog",  //提交用户信息
  barCode: apiurl + "/scan/barCode", //扫条形码
  configinfo: apiurl + "/config/info",//获取后台配置信息
  addOpenNum: apiurl + "/use/addOpenNum",//跳转其他小程序增加点击次数
  usersync: apiurl + "/user/sync"
  
}

module.exports = interfaceurl;

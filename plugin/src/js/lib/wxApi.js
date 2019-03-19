var PromiseF = require("./wxPromise.js");

/**
 * 微信用户登录,获取code
 */
function wxLogin() {
  return PromiseF.wxPromisify(wx.login)
}
/**
 * 获取微信用户信息
 * 注意:须在登录之后调用
 */
function wxGetUserInfo() {
  return PromiseF.wxPromisify(wx.getUserInfo)
}
/**
 * 获取系统信息
 */
function wxGetSystemInfo() {
  return PromiseF.wxPromisify(wx.getSystemInfo)
}
/**
 * 微信支付
 */
function wxPay() {
  return PromiseF.wxPromisify(wx.requestPayment)
}
/**
 * 位置
 */
function wxLocation() {
  return PromiseF.wxPromisify(wx.getLocation)
}
//查看图片预览
function wxpreviewImage(_obj){
  wx.previewImage(_obj)
}
//打开扫码
function wxScanCode(){
  return PromiseF.wxPromisify(wx.scanCode)
}

//保存图片
function wxSaveImg(_path){
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath: _path,
      success:res=>{
        resolve(res)
      },
      fail:error=>{
        reject(error)
      }
    })
  })
  
}
//上传图片
function wxChooseImg(){
  return new Promise((resolve, reject) =>{
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:res=>{
        resolve(res)
      },
      fail:res=>{
        reject(res)
      }
    })
  })
}

function getShareInfo(_tickets){
  return new Promise((resolve, reject) => {
    wx.getShareInfo({
      shareTicket: _tickets,
      success:(res)=>{
        resolve(res)
      },
      fail:(error)=>{
        reject(error)
      }
    })
  })
}

module.exports = {
  wxLogin: wxLogin,
  wxGetUserInfo: wxGetUserInfo,
  wxGetSystemInfo: wxGetSystemInfo,
  wxPay: wxPay,
  wxLocation: wxLocation,
  wxpreviewImage: wxpreviewImage,
  wxScanCode: wxScanCode,
  wxSaveImg: wxSaveImg,
  wxChooseImg: wxChooseImg,
  wxGetShareInfo: getShareInfo
}
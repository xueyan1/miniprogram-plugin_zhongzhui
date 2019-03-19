const app=require('./src/js/index.js');
let callback=null;
//添加用户信息
function setuserinfo(_obj){
  app.DataCenter.appUserInfo = _obj;
}

//传入跳转地址
function setUrl(_url){
  app.DataCenter.jumpUrl = _url;
}
//判断码类型是店铺还是商品
function getCodeType(_query,_callback){
  let opt = decodeURIComponent(_query);
  app.AppScan.upDateQrCode(opt).then(res => {
    
    _callback(res)
  },err=>{
    console.log(err)
  })
}
function _initCallBack(_cb) {
  callback = _cb
}
function _chilcallback(_obj) {
  if (callback) {
    callback(_obj)
  }
}


module.exports = {
  app: app,
  setuserinfo: setuserinfo,
  setUrl: setUrl,
  initCallBack: _initCallBack,
  chilcallback: _chilcallback,
  getCodeType: getCodeType
}
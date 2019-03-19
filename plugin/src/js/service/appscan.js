const util = require("../util.js");
const wxRequest = require("../lib/wxRequest.js");
const appcommon = require("./appcommon.js");
const QRCODETYPE={
  "URL":"QRCODETYPE_URL",
  "ID": "QRCODETYPE_ID",
}
class AppScan{
  constructor(){
    this.qrcodeinfo=""; //码的内容
    this.qrcodetype=""; //码解析的类型
    this.qrcodedata={}; //码解析出来的内容
    this.qrcodeid="";//中追二维码解出来的id
    this.qrgettypedata={};//中追二维码先判断是否走小程序
    this.scanhistorydata = [];//追溯记录
  }
  upDateQrCode(_query){
    this.qrcodeinfo = _query;
    this.qrcodetype = QRCODETYPE.URL;
    return this._checkQrCode();
  }
  _checkQrCode(){
    let tmpobj = {
      code: "",
      url: ""
    }
    if (this.qrcodetype == QRCODETYPE.ID){
      tmpobj.code = this.qrcodeinfo;
    } else if (this.qrcodetype == QRCODETYPE.URL){
      tmpobj.url = this.qrcodeinfo;
    }
    return new Promise((resolve, reject)=>{
      wxRequest.postRequest("getCodeType", tmpobj).then(res=>{
        //console.log(res)
        if (res.statusCode != 200){
          wx.showToast({
            icon: "none",
            title: "网络错误,请稍后再试"
          })
          reject({ "errno": res.statusCode });
          //return;
        }else{
          this.qrgettypedata = res.data;
          //this.qrcodeid = res.data.Data.labelid;
          resolve(res.data)
        }
      })
    })
  }
  getQrCodeData(_obj){
    //console.log("id:", this.qrcodeid)
    let uuidstr = util.guuid()
    let getobj = {
      id: this.qrgettypedata.Data.labelid ? this.qrgettypedata.Data.labelid+"":"",
      cid: this.qrgettypedata.Data.shopid+"",
      token: util.zz_md5(uuidstr),
      uuid: uuidstr
    }
    getobj = Object.assign(getobj, _obj)
    return new Promise((resolve, reject) => {
      wxRequest.postRequest("scanCode", getobj).then(res=>{
        this.qrcodedata = res.data;
        if (this.qrcodedata.Flag){
          resolve(this.qrcodedata)
        }else{
          wx.showToast({
            icon: "none",
            title: this.qrcodedata.Message
          })
          reject(this.qrcodedata)
        }
      })
    })
  }
  
  //扫码条形码
  checkBarCode(_obj) {
    return new Promise((resolve, reject) => {
      wxRequest.getRequest("barCode", _obj).then(res => {
        resolve(res)
      })
    })
  }
  //向自己服务器添加扫码记录
  addHistory(_uid, _token) {
    let brand_id = ""
    if ("brand_id" in this.qrcodedata.Data.Brand){
      brand_id = this.qrcodedata.Data.Brand.brand_id
    }

    let obj = {
      productid: this.qrcodedata.Data.Product.product_id,
      product_name: this.qrcodedata.Data.Product.product_name,
      companyid: this.qrcodedata.Data.Company.company_id,
      company_name: this.qrcodedata.Data.Company.company_name,
      cateid: this.qrcodedata.Data.Company.cate_id ? this.qrcodedata.Data.Company.cate_id : "",
      source: "1",
      address: this.qrcodedata.Data.Info.cons_addr,
      brandid: brand_id,
      brand_name: this.qrcodedata.Data.Brand.brand_name,
      code: this.qrcodedata.Data.Info.label_id,
      num: this.qrcodedata.Data.Info.cons_count
    }
    obj = util.extend(obj, appcommon.getCommonParams(_uid));
    return new Promise((resolve, reject) => {
      wxRequest.getRequest("addHistory", obj, _token).then(res => {
        resolve(res)
      })
    })
  }
  //发送验证
  verification(_obj) {
   
    let _this = this;
    _obj.origin = appcommon.origin
  
      return this._normalverification(_obj);
  }
  //普通验证
  _normalverification(_obj){
    let _this = this;
    return new Promise((resolve, reject) => {
      wxRequest.postRequest("verification", _obj).then(res => {
        //util.consolelog("验证结果",res)
        if (res.data.Flag) {
          _this.qrcodedata.Data.Info.cons_time = res.data.Data.cons_time;
          _this.qrcodedata.Data.Info.cons_addr = res.data.Data.cons_addr;
          _this.qrcodedata.Data.Info.cons_count = 1;
          _this.qrcodedata.Data.Info.cons_jwd = _obj.jwd;
          resolve({ "errno": 0 ,
            "cons_draw": res.data.Data.cons_draw,
            "draw_type": res.data.Data.draw_type})
        } else {
          resolve({ "errno": 1, "msg": res.data.Message })
        }
      })

    })
  }
  //扫码记录
  scanhistory(_obj) {
    let _this = this;
    _obj.origin = appcommon.origin
    return new Promise((resolve, reject) => {
      wxRequest.postRequest("getRecord", _obj).then(res => {

        _this.scanhistorydata = res.data.Data.Record
        resolve(res)
      })
    })

  }
}

module.exports = AppScan;
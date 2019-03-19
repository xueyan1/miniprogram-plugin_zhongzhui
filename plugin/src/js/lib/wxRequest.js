const PromiseF = require("./wxPromise.js");
const ajaxinterface = require("../ajaxinterface.js");
const util = require("../util.js");
/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(urlname, data,tonken="") {
  if (!ajaxinterface[urlname]){
    return chainStop({ "errmsg": "no ajax interface:" + urlname})
  }
  var getRequest = PromiseF.wxPromisify(wx.request)
  return getRequest({
    url: ajaxinterface[urlname],
    method: 'GET',
    data: data,
    header: {
      'content-type': 'application/json',
      'cookie': 'token=' + tonken
    }
  })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(urlname, data) {
  if (!ajaxinterface[urlname]) {
    return chainStop({ "errmsg": "no ajax interface" })
  }
  var postRequest = PromiseF.wxPromisify(wx.request)
  return postRequest({
    url: ajaxinterface[urlname],
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json' // 默认值
    },
  })
}

function chainStop(_obj) {
  let tmpobj = {
    notRealPromiseException: true
  };
  tmpobj = util.extend(tmpobj, _obj);

  return Promise.reject(tmpobj);
}

module.exports = {
  postRequest: postRequest,
  getRequest: getRequest,
  chainStop: chainStop
}
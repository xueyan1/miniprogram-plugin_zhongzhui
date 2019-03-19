const util = require("../util.js");
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)//执行函数，obj为传入函数的参数
    })
  }
} 
function chainStop(_obj) {
  let tmpobj = {
    notRealPromiseException: true
  };
  tmpobj = util.extend(tmpobj, _obj);

  return Promise.reject(tmpobj);
}

module.exports = {
  wxPromisify: wxPromisify,
  chainStop: chainStop
}
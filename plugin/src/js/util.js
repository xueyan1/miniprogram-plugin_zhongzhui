const md5 = require("./lib/md5.js");
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


function md5_16bit(_str) {
  let str = md5.md5(_str);
  return str.substring(8, 24);
}

function zz_md5(_code) {
  let str = _code + "ahc9ooshaiph7Ais8aiy1xe6xa3ti0ioziBach2jee4olaixeicee6ufoh7aGh8e";
  return md5.md5(str);
  //return md5_16bit(_code + "jymf");
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getUrlParam(urls, name) {
  if (typeof urls == "object"){
    let str = ""
    for (let i in urls){
      str += i+ "="+ urls[i]
    }
    urls = str;
  }

  let str = urls.substring((urls.indexOf('?') + 1), urls.length);
 
  let query = null;
  let arr = str.split("&");
  for (let i in arr){
    if (arr[i]){
      let arr2 = arr[i].split("=");
      for (let k = 0; k < arr2.length; k++) {
        if (arr2[k] == name && arr2[k + 1]) {
          query = arr2[k + 1];
            break;
          }
        }
    }
  }
  
  return query;

}

//打印数据
function consolelog(_str, ..._res) {
  console.log("<" + _str + ">");
  for (let item in _res) {
    console.log(_res[item]);
  }
  console.log("</" + _str + ">");
}
//从新封装请求
function reconsitutionWxGetUserInfo(_res) {
  if ('userInfo' in _res) {
    _res = _res.userInfo;
  }
  return _res;
}
// 合并对象
function extend(target, source) {
  for (var property in source) {
    target[property] = source[property]
  }
  return target;
}


// 每隔4个字符加空格间隔
function replaceStr(str) {
  return str.replace(/(.{4})/g, '$1 ');
}

//检测手机
function detect_phone_number(_val) {
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(19[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|(18[0-9]{1}))+\d{8})$/
  if (!myreg.test(_val)) {
    return false
  }
  return true
}

//转码gb2312
function encodeToGb2312(str) {
  var strOut = "";
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    var code = str.charCodeAt(i);
    if (c == " ") strOut += "+";
    else if (code >= 19968 && code <= 40869) {
      index = code - 19968;
      strOut += "%" + z.substr(index * 4, 2) + "%" + z.substr(index * 4 + 2, 2);
    }
    else {
      strOut += "%" + str.charCodeAt(i).toString(16);
    }
  }
  return strOut;
}
//解码gb2312
function decodeFromGb2312(str) {
  var strOut = '';
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    // +是空格
    if (c == '+') {
      strOut += ' ';
    }
    // a,b,c,1,2等，非%开头的，直接返回本身
    else if (c != '%') {
      strOut += c;
    }
    // %开头
    else {
      i++;
      var nextC = str.charAt(i);
      // 数字，则不是汉字
      if (!isNaN(parseInt(nextC))) {
        i++;
        strOut += decodeURIComponent(c + nextC + str.charAt(i));
      }
      else {
        var x = new String();
        try {
          var code = str.substr(i, 2) + str.substr(i + 3, 2);
          i = i + 4;

          var index = -1;
          while ((index = z.indexOf(code, index + 1)) != -1) {
            if (index % 4 == 0) {
              strOut += String.fromCharCode(index / 4 + 19968);
              break;
            }
          }
        } catch (e) { }
      }
    }
  }
  return strOut;
}

function checkIsIphoneX(_data){
  let modelstr = _data.model.replace(/\s/ig, '')
  let seachstr = "iPhoneX";
  if (modelstr.indexOf(seachstr) >= 0) {
    return true;
  } else {
    return false;
  }
}
function ObjIsNull(_obj){
  for (var key in _obj){
    return false;
  }
  return true;
} 
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guuid() {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

module.exports = {
  formatTime: formatTime,
  md5_16bit: md5_16bit,
  zz_md5: zz_md5,
  getUrlParam: getUrlParam,
  consolelog: consolelog,
  reconsitutionWxGetUserInfo: reconsitutionWxGetUserInfo,
  extend: extend,
  replaceStr: replaceStr,
  detect_phone_number: detect_phone_number,
  decodeFromGb2312: decodeFromGb2312,
  encodeToGb2312: encodeToGb2312,
  checkIsIphoneX: checkIsIphoneX,
  ObjIsNull: ObjIsNull,
  guuid: guuid
}

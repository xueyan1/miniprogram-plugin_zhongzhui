const md5 = require("../lib/md5.js");
const companyId = "111111"; 
const wxappid = "wx937a3ada5c7e0616"//"wx937a3ada5c7e0616"
const origin = "wechat";

const sessionname = {
  "appuserinfo":"appUserInfoData",
  "usersysteminfo":"appUserSystemInoData"
}

const companysid = {
  'qiya': '358001161',//起亚 测试=658000188 正式=358001161
  'dianzichubanshe': "658000200", //电子出版社
  'guiyan':"358000018", //贵烟
  'maotai': "358000091",//茅台
  'xuexichubanshe': "10000001",//学习出版社
  'yuntianhua':"358000000"//云天化
}

function getConfig() {
  return {
    source: "xinfadi",
    platform: "wx",
    secret: "c86f83bca350e8cb13b7b098d27a7f1e"
  }
}

function getRand() {
  var _rand = Math.random()
  var d = new Date()
  _rand = md5.md5(Math.round(_rand * 100000000) + d.getTime())
  return _rand.substr(0, 12)
}


function getGuid(uid, rand, time) {
  var cfg = getConfig()

  var keys = new Array()

  var d = {
    uid: uid,
    source: cfg.source,
    platform: cfg.platform,
    rand: rand,
    time: time
  }

  var i = 0;
  for (k in d) {
    keys[i] = k
    i++
  }

  keys.sort()

  var j = 0
  var query = ""
  for (j = 0; j < keys.length; j++) {
    var k = keys[j]
    query += k + "=" + d[k]
  }
  //console.log(query, cfg.secret, md5.md5(query + cfg.secret))
  return md5.md5(query + cfg.secret)
}

function getCommonParams(uid = 0) {
  var day = new Date()
  var time = day.getTime()

  var cfg = getConfig()

  var uid = uid ? uid : 0
  var rand = getRand()
  var guid = getGuid(uid, rand, time)

  var cp = {
    uid: uid,
    source: cfg.source,
    rand: rand,
    guid: guid,
    time: time,
    platform: cfg.platform
  }

  return cp;
}

module.exports = {
  getCommonParams: getCommonParams,
  getCommonConfig: getConfig,
  companyId: companyId,
  sessionname: sessionname,
  wxappid: wxappid,
  origin: origin,
  companysid: companysid
}
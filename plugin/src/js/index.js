const wxApi = require("./lib/wxApi.js");
const wxRequest = require("./lib/wxRequest.js");
const util = require("./util.js");
const DataCenter = require("./dataCenter.js");
const Sappconfig = require("./service/appconfig")
const Event = require("./event.js");
const AppScan = require("./service/appscan.js");
module.exports = {
  wxApi: wxApi,
  utils: util,
  wxRequest: wxRequest,
  DataCenter: new DataCenter(),
  SAppConfig:new Sappconfig(),
  AppScan: new AppScan(),
  event: Event,
}
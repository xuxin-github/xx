const config = require('../config/config.js')
const util = require('./util.js')
const authutil = require('./authutil.js')
/**
 * @param
 * url 接口url,必填
 * method 请求方式,默认GET,非必填
 * params 请求参数=JSON,非必填
 * option 其他配置=JSON,非必填
 */
const request = (url, method, params, option) => {
  
  //构建完整接口地址
  let finalPath = url;
  if (!(url.indexOf("http://") > -1 || url.indexOf("https://") > -1)) {
    //该路径非config配置
    let uriParams = util.getUriParams(url);
    finalPath = config.server.hostname + uriParams.uri + config.server.miniType;
    //补全链接参数
    for (let i = 0; i < uriParams.params.length; i++) {
      finalPath = finalPath + "&" + uriParams.params[i].key +
        "=" + uriParams.params[i].value
    }
  }

  //验证method是否为空，若为空个，默认使用GET
  console.log("method==" + method);
  if (util.isEmpty(method)) {
    method = 'GET'
  } else {

    // method参数转换成大写
    method = method.toUpperCase();

    //判断请求方式是否非法
    if (!(method != "GET" || method != "POST")) {
      method = "GET"
    }
  }

  //获取token
  var token = util.getToken();

  //组织header
  var headerInfo = {
    'content-type': 'application/json',
    'token': token
  }
  
  //提交方式判断
  const qsclude = config.qsclude; 
  for (var i = 0; i < qsclude.length; i++) {
    if (url == qsclude[i]) {
      headerInfo["Content-Type"] = "application/x-www-form-urlencoded";
      break;
    }
  }
  console.log("接口请求开始", {
    "接口地址": finalPath,
    "请求方式": method
  });
  //返回Promise对象
  return new Promise((resolve, reject) => {
    //开始发起请求
    wx.request({
      url: finalPath,
      header: headerInfo,
      data: params,
      method: method,
      success(res) {
        console.log("接口请求成功", {
          "接口地址": finalPath,
          "请求方式": method,
          "返回结果": res
        });
        //在这里进行权限验证
        authutil.checkAuth(res);
        let data = res.data;
        if (util.isEmpty(data)) {
          data = {};
        }
        data.header = res.header;
        data.statusCode = res.statusCode;
        resolve(data);
      },
      fail(resErr) {
        //调用服务器接口失败
        let httpErr = {
          "errMsg": "调用服务器接口失败",
          "errData": resErr
        }
        reject(httpErr);
      }
    })
  })
}

module.exports = {
  request: request
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require("../config/config.js");

var _config2 = _interopRequireDefault(_config);

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _utils = require("./utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 封装http请求
 **/
var HTTPUtil = {};

HTTPUtil.request = function (opt) {
  var uri = opt.uri; //必填
  var subData = opt.subData;
  var method = opt.method;
  //验证method是否为空，若为空个，默认使用GET
  if (_utils2.default.isEmpty(method) == true) {
    method = 'GET';
  } else {
    if (method != "GET" && method != "POST") {
      method = "GET";
    }
  }

  //验证当前用户类型，默认普通用户 1 
  var user_type = opt.user_type;
  if (_utils2.default.isEmpty(user_type) == true) {
    user_type = '1';
  } else {
    if (user_type != "1" && user_type != "2") {
      user_type = "1";
    }
  }
  //获取token
  var userInfo = {};
  if (user_type == 1) {
    userInfo = _index2.default.getStorageSync('userInfo');
  } else if (user_type == 2) {
    userInfo = _index2.default.getStorageSync('muserInfo');
  }

  //构建接口URL
  var url = _config2.default.server + uri + '?miniType=' + _config2.default.miniType;

  var user_type = userInfo.user_type;
  //组织hearder信息
  var headerInfo = {
    'content-type': 'application/json',
    'token': userInfo.token
  };

  return new Promise(function (resolve, reject) {

    _index2.default.request({
      url: url,
      method: method,
      data: subData,
      header: headerInfo,
      success: function success(res) {
        console.log('接口调用:', {
          '接口地址': url,
          '调用方式': method,
          '调用参数': subData,
          '调用成功': res
        });
        //在这里可以写相关错误操作
        if (res.data.code == '4001') {
          showmsg('请登录后查看!');
          if (user_type == 1) {
            userInfo = _index2.default.removeStorageSync('userInfo');
          } else if (user_type == 2) {
            userInfo = _index2.default.removeStorageSync('muserInfo');
          }
          setTimeout(function () {
            if (user_type == 2) {
              _index2.default.redirectTo({ url: '/pages/login/login_work' });
            } else {
              _index2.default.redirectTo({ url: '/pages/authorize/authorize' });
            }
          }, 2000);
        } else if (res.data.code == '4002') {
          showmsg('账号不存在！');
          if (user_type == 1) {
            userInfo = _index2.default.removeStorageSync('userInfo');
          } else if (user_type == 2) {
            userInfo = _index2.default.removeStorageSync('muserInfo');
          }
          setTimeout(function () {
            if (user_type == 2) {
              _index2.default.redirectTo({ url: '/pages/login/login_work' });
            } else {
              _index2.default.redirectTo({ url: '/pages/authorize/authorize' });
            }
          }, 2000);
        } else if (res.data.code == '4003') {
          showmsg('账号被删除！');
          if (user_type == 1) {
            userInfo = _index2.default.removeStorageSync('userInfo');
          } else if (user_type == 2) {
            userInfo = _index2.default.removeStorageSync('muserInfo');
          }
          setTimeout(function () {
            if (user_type == 2) {
              _index2.default.redirectTo({ url: '/pages/login/login_work' });
            } else {
              _index2.default.redirectTo({ url: '/pages/authorize/authorize' });
            }
          }, 2000);
        } else if (res.data.code == '4004') {
          showmsg('账号被禁用！');
          if (user_type == 1) {
            userInfo = _index2.default.removeStorageSync('userInfo');
          } else if (user_type == 2) {
            userInfo = _index2.default.removeStorageSync('muserInfo');
          }
          setTimeout(function () {
            if (user_type == 2) {
              _index2.default.redirectTo({ url: '/pages/login/login_work' });
            } else {
              _index2.default.redirectTo({ url: '/pages/authorize/authorize' });
            }
          }, 2000);
        } else if (res.data.code == '100') {

          showmsg('没有权限！');
          setTimeout(function () {
            _index2.default.navigateBack({ delta: 1 });
          }, 1000);
        }
        resolve(res);
      },
      fail: function fail(resErr) {
        //调用服务器接口失败
        var httpErr = {
          "zhlHttpErrMsg": "调用服务器接口失败",
          "errData": resErr
        };
        reject(httpErr);
      }
    });
  });
};
function showmsg(msg) {
  _index2.default.showToast({
    title: msg,
    icon: 'none',
    duration: 3000
  });
}

exports.default = HTTPUtil;
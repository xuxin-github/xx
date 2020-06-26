const util = require('/utils/util.js');
const authApi = require('/api/authApi.js');
const regeneratorRuntime = require('/module/runtime.js');
const jwtDecode = require('jwt-decode');
const Dec = require("/utils/encAndDes.js");
App({


  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    //var username = wx.getStorageSync('username') || [];

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });


    //设置自定义系统导航栏
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    });
  },

  // 处理当在访问页面时token失效的问题，超过24小时则返回登录页面
  disposePostToken: function () {
    var that = this;
    // 从本地拿到用户第一次时的账号
    var username = wx.getStorageSync('username') || [];
    // 从本地拿到用户第一次时的密码
    var userpsd = wx.getStorageSync('userpsd') || [];
    // 从本地拿到token
    var token = wx.getStorageSync('userToken') || [];
    // 从本地拿到token第一次创建的时间
    var firstTokenTime = wx.getStorageSync('firstTokenTime') || [];
    // 从本地拿到后续token的时间
    var nowTokenTime = wx.getStorageSync('nowTokenTime') || [];
    // 转换格式
    let first_time = util.formatTime("yyyy/MM/dd hh:mm:ss", firstTokenTime);
    let token_time = util.formatTime("yyyy/MM/dd hh:mm:ss", nowTokenTime);
    let now_time = util.formatTime("yyyy/MM/dd hh:mm:ss", Date());
    var date1 = new Date(token_time); // 转换为时间
    var date2 = new Date(now_time);
    var date3 = new Date(first_time);
    // 得到时间戳
    let time1 = date1.getTime(); // 最新token时间
    let time2 = date2.getTime(); // 当前时间
    let time3 = date3.getTime(); // 第一次的token时间
    // console.log("app里后续的Token拿到时间:", time1);
    // console.log("app里当前时间::", time2);
    // console.log("app里第一次的Token创建时间:", time3);
    // 设置接近两小时时就重新获取一次token（因为后台token有效期为两小时，前端人为防止token过期）  
    if (time2 - time1 > 86400000) {
      wx.showToast({
        title: '登录已失效，重新登录中...',
        icon: 'none',
        duration: 3000
      }, wx.reLaunch({
        url: '/pages/login/login',
      }))
    }
    // 防止加载慢，用户体验差，不要一直获取token，失效前1小时更新token即可
    if (86400000 > time2 - time1 && time2 - time1 > 80000000) {
      // 对Token进行解析
      if (token.indexOf("fdkey ") == 0) {
        let decoded = jwtDecode(token.replace("fdkey ", ""));
        console.log("解析结果", decoded);
        if (decoded.auth[0].authority == "-1") {
          self.showmsg('用户不存在！');
        } else if (decoded.auth[0].authority == "-2") {
          self.showmsg('密码错误！');
        } else if (decoded.auth[0].authority == "-3") {
          self.showmsg('账号已被禁用！请联系管理员。');
        } else {
          that.saveToken(username, userpsd, firstTokenTime, decoded.auth);
        }
      }
    }
    this.getRoleCode();
  },
  // 获取用户库里权限,用于处理当用户权限改变时页面的处理
  async getRoleCode() {
    let rs = await authApi.getRoleCode({
      user_id: this.globalData.user_id,
      user_name: wx.getStorageSync('username')
    })
    console.log("--返回结果为：", rs);
    let qx = this.globalData.quanxian[0].authority;
    if (rs.data.role_code != qx.substring(5, qx.length)) {
      wx.showModal({
        title: '温馨提示',
        content: '该用户的权限已被上级更改，请立即重新登录！',
        success(res) {
          if (res.confirm) {
            wx.removeStorage({
              key: 'userToken',
              success(res) {
                wx.removeStorage({
                  key: 'userpsd',
                  success(res) {
                    wx.reLaunch({
                      url: '/pages/login/login',
                    })
                  }
                })
              }
            })
          } else if (res.cancel) {
            wx.removeStorage({
              key: 'userToken',
              success(res) {
                wx.removeStorage({
                  key: 'userpsd',
                  success(res) {
                    wx.reLaunch({
                      url: '/pages/login/login',
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  },

  // 更新最新的token和tokeTime
  async saveToken(username, userpsd, firstTokenTime, decoded_auth) {
    // AES对密码进行解密
    let juserpsd = Dec.Decrypt(userpsd);
    let res = await authApi.valiLogin({
      username: username,
      password: juserpsd,
      company: 1,
      corp: "c",
    });
    console.log("res", res);
    util.setToken(res.header.token, firstTokenTime, res.header.Date, username, userpsd, decoded_auth);
  },

  // 自动登录，并判断是否过期一周
  async login(username, userpsd, firstTokenTime) {
    // 对密码进行解密
    let juserpsd = Dec.Decrypt(userpsd);
    let res = await authApi.valiLogin({
      username: username,
      password: juserpsd,
      company: 1,
      corp: "c",
    });
    let t_time = util.formatTime("yyyy/MM/dd hh:mm:ss", firstTokenTime);
    let now_time = util.formatTime("yyyy/MM/dd hh:mm:ss", Date());
    var date1 = new Date(t_time);
    var date2 = new Date(now_time);
    let time1 = date1.getTime(); // 得到时间戳
    let time2 = date2.getTime();
    // 设置从登录起一周有效期  
    if (time2 - time1 > 604800000) {
      wx.showToast({
        title: '登录失效，请重新登录！',
        icon: 'none',
        duration: 3000
      })
    } else {
      if (res.header.token != '' & res.header.token != null & res.header.token.substr(0, 5) == 'fdkey') {
        let decoded = jwtDecode(res.header.token.replace("fdkey ", ""));
        console.log("解析结果", decoded);
        if (decoded.auth[0].authority == "-1") {
          self.showmsg('用户不存在！');
        } else if (decoded.auth[0].authority == "-2") {
          self.showmsg('密码错误！');
        } else if (decoded.auth[0].authority == "-3") {
          self.showmsg('账号已被禁用！请联系管理员。');
        } else {
          // 保存最新的token和token时间
          this.globalData.quanxian = decoded.auth;
          this.globalData.user_id = decoded.sub.substring(0, decoded.sub.lastIndexOf("\|"));
          console.log("id", this.globalData.user_id);
          util.setToken(res.header.token, firstTokenTime, res.header.Date, username, userpsd, decoded.auth);
          wx.showToast({
            title: '欢迎回来！',
            icon: 'success',
            duration: 2000
          }, wx.reLaunch({
            url: '/pages/index/index?username=' + username,
          }))
        }
      }
    }
  },

  globalData: {
    user_id: '', // 用户id
    username: '', // 用户名
    quanxian: [], // 权限
    expendInvoice: [], // 我要报销中的报销发票
    bx_list: [], // 我要报销中的报销信息
    userInfo: null,
    shopuserInfo: null,
    model: null,
    serverurl: "http://wiki.fudengtech.com/weixin",
    serverhostname: "http://wiki.fudengtech.com",
    webSocketServer: "http://wiki.fudengtech.com",
    params: "?miniapptype=fenghuotai",
  },
  userInfoReadyCallback: function (userInfo) {
    this.globalData.userInfo = userInfo;
  }
})
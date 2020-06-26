const regeneratorRuntime = require('../../module/runtime.js')
const authApi = require('../../api/authApi.js');
const jwtDecode = require('jwt-decode');
const util = require('../../utils/util.js');
const authutil = require('../../utils/authutil.js');
const Dec = require("../../utils/encAndDes.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '', // 账号
    psd: '', // 密码
    company: '1', // 公司id
    username: wx.getStorageSync('username')
  },

  // 账号
  handleAccount: function(e) {
    console.log("账号:", e.detail.value);
    this.setData({
      account: e.detail.value
    })
    // 将账号存到全局变量中
    app.globalData.username = e.detail.value;
  },

  // 密码
  handlePsd: function(e) {
    console.log("密码:", e.detail.value);
    this.setData({
      psd: e.detail.value
    })
  },
  // 登录
  async handleLogin() {
    var self = this;
    if(self.data.account != "" ){
      var account = self.data.account;
    }else{
      var account = self.data.username;
    }   
    var psd = self.data.psd;
    var company = self.data.company;
    if (account == '' || account == null || account == undefined) {
      self.showmsg('账号不能为空');
      return false;
    } else if (psd == '' || psd == null || psd == undefined) {
      self.showmsg('密码不能为空');
      return false;
    } else {
      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      let res = await authApi.valiLogin({
        username: account,
        password: psd,
        company: company,
        corp:"c",
      });
      console.log("res",res);
      authutil.checkAuth(res);
      // 对Token进行解析
      if (res.header.token.indexOf("fdkey ") == 0) {
        let decoded = jwtDecode(res.header.token.replace("fdkey ", ""));
        console.log("解析结果", decoded);
        if (decoded.auth[0].authority == "-1") {
          self.showmsg('用户不存在！');
        } else if (decoded.auth[0].authority == "-2") {
          self.showmsg('密码错误！');
        } else if (decoded.auth[0].authority == "-3") {
          self.showmsg('账号已被禁用！请联系管理员。');
        }else {
          //  AES对密码进行加密
          let aespsd = Dec.Encrypt(psd);
          app.globalData.quanxian = decoded.auth;
          app.globalData.user_id = decoded.sub.substring(0, decoded.sub.lastIndexOf("\|"));
          console.log("id", app.globalData.user_id);
          util.setToken(res.header.token, res.header.Date, res.header.Date, account, aespsd, decoded.auth);
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    }
  },
  showmsg: function(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 1500,
      mask: true
    })
  },

  /**
   * 联系我们
   */
  call: function() {
    wx.showToast({
      title: '请拨打电话 158xxxxxxxx',
      icon: 'none',
      duration: 3000
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    // 从本地拿到用户名 
    wx.getStorage({
      key: 'username',
      success: function(res) {
        let username = res.data;
        // 从本地拿到token创建的时间
        wx.getStorage({
          key: 'nowTokenTime',
          success: function(res) {
            let t_time = util.formatTime("yyyy/MM/dd hh:mm:ss", res.data);
            let now_time = util.formatTime("yyyy/MM/dd hh:mm:ss", Date());
            var date1 = new Date(t_time);
            var date2 = new Date(now_time);
            let time1 = date1.getTime(); // 得到时间戳
            let time2 = date2.getTime();
            // 如果超过了24个小时
            if (time2 - time1 > 86400000) {
              var userpsd = wx.getStorageSync('userpsd') || [];
              app.login(username, userpsd, res.data);
            } else {
              wx.getStorage({
                key: 'userToken',
                success: function(res) {
                  if (res.data != '' & res.data != null & res.data.substr(0, 5) == 'fdkey') {
                    let decoded = jwtDecode(res.data.replace("fdkey ", ""));
                    if (decoded.auth[0].authority == "-1") {
                      self.showmsg('用户不存在！');
                    } else if (decoded.auth[0].authority == "-2") {
                      self.showmsg('密码错误！');
                    } else if (decoded.auth[0].authority == "-3") {
                      self.showmsg('账号已被禁用！请联系管理员。');
                    } else {
                      app.globalData.quanxian = decoded.auth;
                      app.globalData.user_id = decoded.sub.substring(0, decoded.sub.lastIndexOf("\|"));
                      console.log("id", app.globalData.user_id);
                      wx.showToast({
                        title: '欢迎回来！',
                        icon: 'success',
                        duration: 2000
                      }, wx.reLaunch({
                        url: '/pages/index/index',
                      }))
                    }
                  }
                }
              })
            }
          },
        })
      },

    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
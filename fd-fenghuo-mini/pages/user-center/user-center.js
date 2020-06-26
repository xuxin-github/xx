//退出
const util = require('../../utils/util.js')

Page({
  data: {
    username:'',
    company_name:''
  },

  output:function(){
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
  },

  onLoad: function (options) {
    let u_name = options.username;
    let c_name = options.company_name;
    this.setData({
      username:u_name,
      company_name:c_name
    })
  }
})

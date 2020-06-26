const regeneratorRuntime = require('../../module/runtime.js')
const authApi = require('../../api/authApi.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uploadimgs: [],
    option: {
      url: "/common/file/upload",
      host: "http://wiki.fudengtech.com:8181",
      miniType: "",
      warming: {
        txt: "",
      },
      addIcon:2
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToken();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getValue: function (e) {
    let value = e.detail.value; // 自定义组件触发事件时提供的detail对象
    console.log("value====", value);
  },
  onInput:function(e){
    console.log("input输入==",e.detail);
  },
  async getToken(){
    let rs = await authApi.genJwtToken();
    console.log("请求结果", rs);
  }
})
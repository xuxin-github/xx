// pages/components/components.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadimgs: ['https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640'],
    option1: {
      url: "/common/upload/img",
      host: "https://wiki.fudengtech.com",
      miniType: "?miniapptype=caohejing",
      warming: {
        txt: "",
      }
    },
    option2: {
      url: "/common/upload/img",
      host: "https://wiki.fudengtech.com",
      miniType: "?miniapptype=caohejing",
      addIcon: "2"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },
  getImgs: function(e) {
    let value = e.detail; // 自定义组件触发事件时提供的detail对象
    console.log("value", value);
  },
  addImg: function() {
    let that = this;
    let imgs = that.data.uploadimgs;
    imgs.push('https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640');
    that.setData({
      uploadimgs: imgs
    })
  },
  onInput(e) {
    console.log("输入的值==" + e.detail.value);
  }
})
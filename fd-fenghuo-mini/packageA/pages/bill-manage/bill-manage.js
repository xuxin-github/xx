// 发票列表
const regeneratorRuntime = require('../../../module/runtime.js')
const billApi = require('../../../api/billApi.js');
var util = require('../../../utils/util.js');
const app = getApp();
var page = 1;
var page_size = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [], // 发票列表
    inputValue: '', // 查询框的值
    pageSize:10, // 每页显示条数
    page:1 ,  // 页码
    totalSize:'' , // 总条数 
    quanxian:[]
  },

  // 搜索框
  onInput: function(e) {  
    console.log("input", e.detail.value); 
    this.setData({
      inputValue: e.detail.value
    })
    this.invoiceList();
  },

  // 转到详情页面  
  detail: function (e) {
    let no = e.currentTarget.dataset.index1;
    let code = e.currentTarget.dataset.index2;
    let contract_id = e.currentTarget.dataset.index3;
    console.log("no",e.currentTarget.dataset.index1);
    console.log("code", e.currentTarget.dataset.index2);
    console.log("contract_id", e.currentTarget.dataset.index3);
    if (contract_id != undefined){
      wx.navigateTo({ url: '../bill-details/bill-details?no=' + no + '&code=' + code });
    }else{
      wx.navigateTo({ url: '../bill-nopass-details/bill-nopass-details?no=' + no + '&code=' + code });
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.invoiceList();
    app.disposePostToken();

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
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    this.setData({
      inputValue: ''
    });
    this.invoiceList();

    wx.stopPullDownRefresh() 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.pageSize < this.data.totalSize){
          this.setData({
            pageSize: this.data.pageSize*2
          })
          this.invoiceList();
      }else{
        wx.showToast({
          title: '没有更多数据!',
          image: '../../../images/icon/jinggao.png',
          duration: 3000
        })
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 定义方法,请求数据
   */
  async invoiceList() {
    // console.log("开始调用", rs);
    var quanxian = wx.getStorageSync('quanxian') || [];
    
    // 权限控制要传的参数，来达到控制显示内容的目的.
    // 普通角色
    if (quanxian[0].authority == 'ROLE_COMMON'){
      var user_id = app.globalData.user_id;
    }else
    // 主管角色
      if (quanxian[0].authority == 'ROLE_DIRECTOR') {
      var user_id = app.globalData.user_id;
    }else{
      // 领导或财务
      var user_id = '' ;
    }
    let rs = await billApi.invoiceList({
      page: this.data.page,
      pageSize: this.data.pageSize,
      user_id: user_id,
      queryParams: { invoice_criteria: this.data.inputValue}
    }); 
    console.log("inputValue", this.data.inputValue);
    console.log("请求结果", rs);
      // 设置时间格式   
      let comms = rs.data.datalist
      console.log(comms)
      for (let c in comms) {
        let time = comms[c].invoice_time.replace(/\-/g, "/");
      //  let date = util.formatTime('yyyy/MM/dd',comms[c].invoice_time)
        comms[c].invoice_time = time.substring(0, 10);
      }
      // 存入数据
      this.setData({
        listData: comms,
        totalSize:rs.data.totalSize,
        quanxian: quanxian
      });   
    
  },

})

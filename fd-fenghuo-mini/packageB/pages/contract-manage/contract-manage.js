// 合同管理
const regeneratorRuntime = require('../../../module/runtime.js')
const contractApi = require('../../../api/contractApi.js');
var util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [], // 合同列表
    inputValue: '', // 搜索框值
    company_id:1, // 公司id
    pageSize: 10, // 每页最大显示数
    page: 1 , // 页码
    totalSize:'' // 总列表数
  },

  // 搜索框
  onInput: function (e) {
    console.log("input", e.detail.value);
    this.setData({
      inputValue: e.detail.value
    })
    this.contractList();
  },

  // 跳转到页面详情
  detail:function(e){
    let contract_code = e.currentTarget.dataset.index1;
    let contract_name = e.currentTarget.dataset.index2;
    wx.navigateTo({ url: '../contract-detail/contract-detail?contract_code=' + contract_code + '&contract_name=' + contract_name });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.contractList();
    app.disposePostToken();
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
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    this.setData({
      inputValue: ''
    });  
    this.contractList();
    wx.stopPullDownRefresh()   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageSize < this.data.totalSize) {
      this.setData({
        pageSize: this.data.pageSize * 2
      })
      console.log("pagesize", this.data.pageSize)
      this.contractList();
    } else {
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
  onShareAppMessage: function () {

  },

  /**
   * 定义方法,请求数据
   */
  async contractList() {
    // console.log("开始调用", rs);
    var quanxian = wx.getStorageSync('quanxian') || [];
    // 权限控制要传的参数，来达到控制显示内容的目的.
      // 主管角色
    if (quanxian[0].authority == 'ROLE_DIRECTOR') {
        var user_id = app.globalData.user_id;
      } else {
        // 领导或财务
        var user_id = '';
      }
    let rs = await contractApi.contractList({
      page: this.data.page,
      pageSize: this.data.pageSize,
      queryParams: { contract_params: this.data.inputValue }, //此时没传状态
      company_id: this.data.company_id,
      user_id:user_id
    });
    console.log("inputValue", this.data.inputValue);
    console.log("请求结果", rs);
    // 设置时间格式   
    let comms = rs.data.datalist
    console.log(comms)
    for (let c in comms) {
      let time = comms[c].create_time.replace(/\-/g, "/");
      comms[c].create_time = time.substring(0, 10);
    }
    // 存入数据
    this.setData({
      listData: comms,
      totalSize: rs.data.totalSize
    });
  },

})
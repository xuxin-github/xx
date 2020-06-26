// 关联到已有合同
const regeneratorRuntime = require('../../../module/runtime.js')
const billApi = require('../../../api/billApi.js');
var util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '', // 方法返回值，判断是否成功
    checkedId: '', // 选择的值
    inputValue: '', // 搜索框的值
    invoice_code: '', // 发票代码
    invoice_no: '',
    s_name: '', // 供应商
    pageSize: 10, // 每页显示条数
    page: 1, // 页码
    listData: [], // 合同列表数据
    listAllData: [] // 所有合同的数据
  },

  // 搜索框
  onInput: function(e) {
    console.log("input输入==", e.detail);
    this.setData({
      inputValue: e.detail.value
    });
    this.findAllContractList();
  },

  // 提交审核
  ok: function(e) {
    if(this.data.checkedId !=''){
      this.insertConnectContract();
    }else{
      wx.showToast({
        title: '提交失败!',
        image: '../../../images/icon/jinggao.png',
        duration: 2000
      }) 
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let code = options.code; // 发票代码
    let s_name = options.s_name; // 供应商
    let no = options.no; // 发票编号
    this.setData({
      invoice_code: code,
      s_name: s_name,
      invoice_no: no,
    });
    this.findAllContractList();
    this.findAllContractLists();
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
      checkedId: '',
      inputValue: ''
    });
    this.findAllContractList();

    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.pageSize < this.data.listAllData.length) {
      this.setData({
        pageSize: this.data.pageSize * 2
      })
      this.findAllContractList();
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
  onShareAppMessage: function() {

  },
  // 选择
  selectChange: function(e) {
    this.setData({
      checkedId: e.currentTarget.dataset.cid
    })
    console.log("checkedId", e.currentTarget.dataset.cid);
  },

  // 改变选择的值
  cancelChange: function(e) {
    this.setData({
      checkedId: e.currentTarget.dataset.cid
    })
  },

  /**
   * 得到合同列表
   */
  async findAllContractList() {  
    const quanxian = app.globalData.quanxian;
    // 权限判断，若为主管
    if (quanxian[0].authority == 'ROLE_DIRECTOR'){
      // 传入当前用户ID
      var user_id = app.globalData.user_id;
    }else{
      var user_id = '';  // 查询全部
    }
    let rs = await billApi.findAllContractList({
      page: this.data.page,
      pageSize: this.data.pageSize,
      s_name: this.data.s_name,
      user_id:user_id,
      contract_params: this.data.inputValue,
    });
    let comms = rs.data;
    this.setData({
      listData: comms
    })
    console.log("请求结果", rs);
  },

  /**
   * 关联已有合同
   */
  async insertConnectContract() {
    let rs = await billApi.insertConnectContract({
      contract_code: this.data.checkedId,
      invoice_code: this.data.invoice_code,
      invoice_no_short: this.data.invoice_no,
      seller_name: this.data.s_name
    });
    console.log("请求结果", rs);
    let code = rs.code;
    this.setData({
      code: code
    });
    code != 0 ?
      wx.showToast({
        title: '提交失败!',
        image: '../../../images/icon/jinggao.png',
        duration: 2000
      }) :
      wx.showToast({
        title: '提交成功!',
        icon: 'success',
        duration: 2000
      });
    wx.navigateTo({
      url: '../bill-scan-add-wait/bill-scan-add-wait?no=' + this.data.invoice_no + '&code=' + this.data.invoice_code, // 跳转到审核中的详情页面
    })
  },

  /**
   * 得到所以合同列表，不分页
   */
  async findAllContractLists() {
    let rs = await billApi.findAllContractList({
      page: 1,
      pageSize: 9999,
      s_name: this.data.s_name,
    });
    this.setData({
      listAllData: rs.data
    })
  },

})
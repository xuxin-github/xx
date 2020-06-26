// 报销记录
const regeneratorRuntime = require('../../../module/runtime.js')
const expendApi = require('../../../api/expendApi.js');
var util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [], // 条件查询的报销列表
    inputValue: '', // 搜索框值
    company_id: 1, // 公司id
    pageSize: 10, // 每页最大显示数
    page: 1, // 页码
    totalSize: '', // 列表总数
  },

  // 搜索框
  onInput: function(e) {
    console.log("input", e.detail.value);
    this.setData({
      inputValue: e.detail.value
    })
    this.expendList();
  },

  // 跳转到详情页面
  detail: function(e) {
    let type_name = e.currentTarget.dataset.index1;
    let bx_code = e.currentTarget.dataset.index2;
    wx.navigateTo({
      url: '../expend-detail/expend-detail?name=' + type_name + '&code=' + bx_code,
    })
  },

  // 我要报销
  bindExpend: function() {
    wx.navigateTo({
      url: '../start-expend/start-expend',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.expendList();
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
    let pages = getCurrentPages(); // 获得当前页面栈
    console.log("当前页面栈", pages);
    if (pages.length > 3) {
      wx.navigateBack({
        delta: pages.length + 1,
      })
    }
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
    this.expendList();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.pageSize < this.data.totalSize) {
      this.setData({
        pageSize: this.data.pageSize * 2
      })
      this.expendList();
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

  /**
   * 获取报销数据列表
   */
  async expendList() {
    var quanxian = wx.getStorageSync('quanxian') || [];
    // 权限控制要传的参数，来达到控制显示内容的目的.
    // 主管角色
    if (quanxian[0].authority == 'ROLE_COMMON' || quanxian[0].authority == 'ROLE_DIRECTOR') {
      let user_id = app.globalData.user_id;
      let rs = await expendApi.selectAllList1({
        params: this.data.inputValue,
        user_id: user_id,
        page: this.data.page,
        pageSize: this.data.pageSize
      })
      console.log("返回结果1", rs);
      // 计算无票金额
      if (rs.data.datalist != '') {
        for (let i in rs.data.datalist) {
          if (rs.data.datalist[i].price_amount != undefined) {
            let noInvoicePrice = rs.data.datalist[i].bx_money - rs.data.datalist[i].price_amount; // 报销金额 - 发票金额
            if(noInvoicePrice < 0){
              rs.data.datalist[i]["nIP"] = 0
            }else{
            rs.data.datalist[i]["nIP"] = noInvoicePrice.toFixed(2); // 取小数点后两位,加入结果数组中去
            }
          } else {
            let noInvoicePrice = rs.data.datalist[i].bx_money - 0; // 报销金额 - 发票金额
            if(noInvoicePrice < 0){
              rs.data.datalist[i]["nIP"] = 0
            }else{
            rs.data.datalist[i]["nIP"] = noInvoicePrice.toFixed(2); // 取小数点后两位,加入结果数组中去
            }
          }  
        }
        this.setData({
          listData: rs.data.datalist,
          totalSize: rs.data.totalSize
        })
      }else{
        this.setData({
          listData: rs.data.datalist,
          totalSize: rs.data.totalSize
        })
      }
    } else {
      // 领导或财务
      let rs = await expendApi.selectAllList2({
        params: this.data.inputValue,
        page: this.data.page,
        pageSize: this.data.pageSize
      })
      console.log("返回结果2", rs);
      // 计算无票金额
      if (rs.data.datalist != '') {
        for (let i in rs.data.datalist) {
          if (rs.data.datalist[i].price_amount != undefined){
            let noInvoicePrice = rs.data.datalist[i].bx_money - rs.data.datalist[i].price_amount; // 报销金额 - 发票金额
            if(Number(noInvoicePrice) < 0){
              rs.data.datalist[i]["nIP"] = 0
            }else{
            rs.data.datalist[i]["nIP"] = noInvoicePrice.toFixed(2); // 取小数点后两位,加入结果数组中去
            }
          }else{
            let noInvoicePrice = rs.data.datalist[i].bx_money - 0; // 报销金额 - 发票金额
            if(Number(noInvoicePrice) < 0){
              rs.data.datalist[i]["nIP"] = 0
            }else{
            rs.data.datalist[i]["nIP"] = noInvoicePrice.toFixed(2); // 取小数点后两位,加入结果数组中去
            }
          }          
        }
        this.setData({
          listData: rs.data.datalist,
          totalSize: rs.data.totalSize
        })
      }else{
        this.setData({
          listData: rs.data.datalist,
          totalSize: rs.data.totalSize
        })
      }
    }
  },
})
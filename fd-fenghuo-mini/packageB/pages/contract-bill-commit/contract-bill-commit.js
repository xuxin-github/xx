// 合同发票记录的提交审核发票信息页面
const regeneratorRuntime = require('../../../module/runtime.js')
const billApi = require('../../../api/billApi.js');
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    contract_code: '', // 合同编号
    contract_name:'', // 合同名称
    invoice_code: '', // 发票代码
    invoice_no: '', // 发票编号
    s_name:'', // 发票供应商

  },

  // 提交审核(把查询出来的发票放入到合同发票记录中，并且是待审核状态)
  toCommit:function(){
    this.invoiceCommit();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });
    var contract_code = options.contract_code;
    var code = options.bill_id;
    var no = options.bill_number;
    var contract_name = options.contract_name;
    this.setData({
      contract_code: contract_code,
      invoice_code: code,
      invoice_no: no,
      contract_name: contract_name,
    });
    this.getInvoiceByNo();
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
    wx.stopPullDownRefresh()
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


  /**
   * 查询数据，渲染页面
   */
  async getInvoiceByNo() {
    let rs = await billApi.invoiceFirstDetail({
      invoice_no_short: this.data.invoice_no,
      invoice_code: this.data.invoice_code,
    });
    console.log("请求返回查询结果", rs);

    let comms = rs.data.invoice;
    console.log(comms)

    // 设置时间格式 
    if (comms.invoice_time != '') {
      let time1 = comms.invoice_time.replace(/\-/g, "/");  // 防止在苹果上出现乱码的问题
      //let date1 = util.formatTime('yyyy/MM/dd', comms.invoice_time)
      comms.invoice_time = time1.substring(0, 10);
    }
    if (comms.create_time != '') {
      let time2 = comms.create_time.replace(/\-/g, "/");
      //let date2 = util.formatTime('yyyy/MM/dd', comms.create_time)
      comms.create_time = time2.substring(0, 10);
    }
    // 取效验码后六位
    if (comms.check_code != '') {
      comms.check_code = comms.check_code.substring(14); //要截取字段的字符串 
    }
    // 取汉字与数字
    if (comms.b_account == " " || comms.b_account == "") {
      comms.b_account1 = '--';
      comms.b_account2 = '--';
    } else {
      comms.b_account1 = comms.b_account.match(/[\u4e00-\u9fa5]/g).join(""); // 购方开户行
      comms.b_account2 = comms.b_account.match(/\d+/g); // 购方开户行账号
    }
    if (comms.s_account == " " || comms.s_account == "") {
      comms.s_account1 = '--';
      comms.s_account2 = '--';
    } else {
      comms.s_account1 = comms.s_account.match(/[\u4e00-\u9fa5]/g).join(""); // 销方开户行
      comms.s_account2 = comms.s_account.match(/\d+/g); // 销方开户行账号
    }
    // 存入数据
    this.setData({
      listData: comms,
      s_name:comms.s_name
    });
    // 取消提示框
    setTimeout(function() {
      wx.hideLoading()
    });
  },

  // 提交审核按钮
async invoiceCommit(){
  let rs = await billApi.insertConnectContract({
    contract_code: this.data.contract_code,
    invoice_code: this.data.invoice_code,
    invoice_no_short: this.data.invoice_no,
    seller_name: this.data.s_name
  })
  console.log("提交审核请求结果", rs);
  let code = rs.code;
  this.setData({
    code: code
  });
  
  if(code == 0) {
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 3000
    })
    // 跳转到合同发票记录页面
    wx.redirectTo({
      url: '../contract-detail/contract-detail?contract_code=' + this.data.contract_code + '&contract_name=' + this.data.contract_name,
    })
  } else if (code == 1){
    wx.showToast({
      title: '提交失败',
      icon: 'none',
      duration: 3000
    })
  } else if (code == 2){
    wx.showToast({
      title: '发票的销方与合同供应商不一致',
      icon: 'none',
      duration: 3000
    }) 
  }
  
}

})
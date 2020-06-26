// 领导/财务/主管的发票信息页面
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
    invoice_type: '', // 发票类型
    invoice_code: '', // 发票代码
    invoice_no: '', // 发票编号
    invoice_money: '', // 发票金额
    invoice_createTime: '', // 开票时间
    invoice_check_code: '', // 效验码
    s_name: '', // 发票供应商

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });
    var type = options.bill_type;
    var code = options.bill_id;
    var no = options.bill_number;
    var check_id = options.bill_xy_id;
    var money = options.bill_money;
    var createTime = options.bill_time;
    this.setData({
      invoice_type: type,
      invoice_code: code,
      invoice_no: no,
      invoice_money: money,
      invoice_createTime: createTime,
      invoice_check_code: check_id,
    });
    this.getInvoiceByNo();
    // 将发票信息存到全局中，方便返回时能取到数据
    let list = app.globalData.expendInvoice;
    app.globalData.expendInvoice = [...list, ...this.data.listData];
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
   *  我要报销
   */
  bindExpend: function(e) {
   // if (this.data.listData.create_by == app.globalData.user_id) { 判断当前发票是否是本人添加的
      // 将发票直接加入到报销页面中
      let arr = [{
        "invoice_code": this.data.invoice_code,
        "invoice_no_short": this.data.invoice_no,
        "price_amount": this.data.invoice_money
      }];
      let a = app.globalData.expendInvoice;
      if (a != '') {
        for (let i in a) {
          if (a[i].invoice_code != this.data.listData.invoice_code && a[i].invoice_no != this.data.listData.invoice_no_short && a[i].invoice_money != this.data.listData.price_amount) {
          } else {
            wx.showToast({
              title: '该发票已在待报销列表中',
              icon: 'none',
              duration: 3000,
            })
          }
        }
      } else {
        let arrs = [...a, ...arr];
        app.globalData.expendInvoice = arrs;
      }
      wx.navigateTo({
        url: '../../../packageC/pages/start-expend/start-expend',
      });
    // } else {
    //   wx.showToast({
    //     title: '此发票已被他人使用',
    //     icon: 'none',
    //     duration: 3000,
    //   })
    // }
  },

  /**
   *  关联已有合同
   */
  relateContract: function(e) {
    wx.navigateTo({
      url: '../bill-relate-contract/bill-relate-contract?code=' + this.data.invoice_code + '&s_name=' + this.data.listData.s_name + '&no=' + this.data.invoice_no
    });
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
      let time1 = comms.invoice_time.replace(/\-/g, "/"); // 防止在苹果上出现乱码的问题
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
      s_name: comms.s_name
    });
    // 取消提示框
    setTimeout(function() {
      wx.hideLoading()
    });

  }

})
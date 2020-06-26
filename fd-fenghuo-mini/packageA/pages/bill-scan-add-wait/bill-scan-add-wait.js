// 正在审核中的发票信息页面
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
    s_name:'', // 发票供应商

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });
    var code = options.code;
    var no = options.no;
    this.setData({
      invoice_code: code,
      invoice_no: no,
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
    let pages = getCurrentPages(); // 获得当前页面栈
    console.log("当前wait页面栈", pages);
    // 如果是从添加发票进去，到达最后页面时，返回首页，且更新首页信息
    if(pages[1].route == "packageA/pages/bill-scan-add-leader/bill-scan-add-leader" || pages[1].route =='packageA/pages/bill-scan-add-wait/bill-scan-add-wait'){
      wx.navigateBack({
        delta: pages.length + 1,
        success: function () {
          pages[0].onLoad(); // 执行需要返回页面的onLoad方法
        }
      })
    }else {
      if(pages.length = 5 && pages[4].route == 'packageA/pages/bill-scan-add-wait/bill-scan-add-wait'){
        
      }else if(pages.length > 4){
        wx.navigateBack({
          delta: 2,
        })
      }else if(pages.length > 3){
        wx.navigateBack({
          delta: 1,
        })
      }
    }
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
    let rs = await billApi.invoiceDetail({
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

  }

})
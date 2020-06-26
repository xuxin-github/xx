// 确认报销的发票信息页面
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
    invoice_code: '', // 发票代码
    invoice_no: '', // 发票编号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var invoiceCode = options.code;
    var invoiceNo = options.no;
    this.setData({
      invoice_code: invoiceCode,
      invoice_no: invoiceNo,
    });
    this.getInvoiceByNo();
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
    wx.stopPullDownRefresh()
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

  /**
   *  暂不添加
   */
  noAdd: function (e) {
    let pages = getCurrentPages(); // 获得当前页面栈
    console.log("当前页面栈11", pages);
    if (pages.length > 4) {
      wx.navigateBack({
        delta: 2,
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  /**
   *  确认添加
   */
  confirmedAdd: function (e) {
  //  if ( (app.globalData.quanxian[0].authority != "ROLE_COMMON" && app.globalData.quanxian[0].authority != "ROLE_DIRECTOR") ) {
      let arr = [{
        "invoice_code": this.data.listData.invoice_code,
        "invoice_no_short": this.data.listData.invoice_no_short,
        "price_amount": this.data.listData.price_amount
      }];
      let a = app.globalData.expendInvoice;
      if (a != '') {
        for (let i in a) {
          if (a[i].invoice_code != this.data.listData.invoice_code && a[i].invoice_no != this.data.listData.invoice_no_short && a[i].invoice_money != this.data.listData.price_amount) {
            let arrs = [...a, ...arr];
            app.globalData.expendInvoice = arrs;
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


        let pages = getCurrentPages(); // 获得当前页面栈
        console.log("当前页面栈22", pages);
        // 当从添加发票进入到报销页面时
        if (pages[1].route == "packageC/pages/start-expend/start-expend") {
          if (pages.length > 3) {
            wx.navigateBack({
              delta: 2,
              success: function () {
                pages[1].onLoad(); // 执行需要返回页面的onLoad方法
                console.log("pages[1]", pages[1]);
              }
            })
          } else {
            wx.navigateBack({
              delta: 1,
              success: function () {
                pages[1].onLoad(); // 执行需要返回页面的onLoad方法
                console.log("pages[1]", pages[1]);
              }
            })
          }
        } else // 直接通过报销进入
          if (pages.length = 5) {
            wx.navigateBack({
              delta: 1, // 从后往前算，即倒数第3个
              success: function () {
                pages[2].onLoad(); // 执行需要返回页面的onLoad方法
              }
            })
          } else if (pages.length = 6) {
          wx.navigateBack({
            delta: 2, // 从后往前算，即倒数第3个
            success: function () {
              pages[3].onLoad(); // 执行需要返回页面的onLoad方法
            }
          })
        } else {
          wx.navigateBack({
            delta: 1,
            success: function () {
              pages[2].onLoad(); // 执行需要返回页面的onLoad方法
              console.log("pages[2]", pages[2]);
            }
          })
        }
      }

    // } else {
    //   wx.showToast({
    //     title: '该发票已被他人使用',
    //     icon: 'none',
    //     duration: 3000,
    //   })
    // }

  },

  /**
   * 查询数据，渲染页面
   */
  async getInvoiceByNo() {
    console.log("shuju", this.data.invoice_code, this.data.invoice_no);
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
    });
    // 取消提示框
    setTimeout(function () {
      wx.hideLoading()
    });

  }

})
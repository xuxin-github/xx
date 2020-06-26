// 发票详情
const regeneratorRuntime = require('../../../module/runtime.js')
const billApi = require('../../../api/billApi.js');
var util = require('../../../utils/util.js');
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
      listData:[],  // 发票详情数据
      bx_listData:[], // 报销信息
      invoice_no:'', // 发票号码
      invoice_code:'', // 发票代码
      quanxian:[]
  },

  // 跳转到对应合同
  toContract:function(e){
    let contract_name = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../../packageB/pages/contract-detail/contract-detail?contract_name=' + contract_name,
    })
  },

  // 跳转到对应报销
  toExpend: function (e) {
    let expend_name = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../../packageC/pages/expend-detail/expend-detail?expend_name=' + expend_name,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    // 接到参数
    let no = options.no;
    let code = options.code;
    this.setData({
      invoice_no:no,
      invoice_code:code,
      quanxian: app.globalData.quanxian,
    });
    this.invoiceDetail();
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
    // let pages = getCurrentPages(); // 获得当前页面栈
    // console.log("当前页面栈", pages);
    // if (pages.length > 4) {
    //    wx.navigateBack({
    //      delta:pages.length + 1,
    //    })     
    // }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { 
    wx.stopPullDownRefresh({
      success(res) {
        console.log('刷新成功');
      }
    })

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
   * 定义方法,请求数据
   */
  async invoiceDetail() {
    console.log("开始调用", rs);
    let rs = await billApi.invoiceFirstDetail({   
      invoice_no_short: this.data.invoice_no,
      invoice_code:this.data.invoice_code,
    });
    console.log("请求结果", rs);
      
    let comms = rs.data.invoice
    // 设置时间格式 
    if (comms.invoice_time != ""){   
     // let date1 = util.formatTime('yyyy.MM.dd', comms.invoice_time)
      let time1 = comms.invoice_time.replace(/\-/g, "/");
      comms.invoice_time = time1.substring(0, 10);;
    }
    if (comms.create_time != ""){
      let time2 = comms.create_time.replace(/\-/g, "/");
      // let date2 = util.formatTime('yyyy.MM.dd', time2);
      comms.create_time = time2.substring(0, 10);
    }   
    // 取效验码后六位
    if (comms.check_code != ''){
      comms.check_code = comms.check_code.substring(14); //要截取字段的字符串 
    } 
    if (comms.b_account == " " || comms.b_account == "" ){
       comms.b_account1 = '--';
       comms.b_account2 = '--';
       }else{
       // 取汉字与数字
       comms.b_account1 = comms.b_account.match(/[\u4e00-\u9fa5]/g).join("");
       comms.b_account2 = comms.b_account.match(/\d+/g);
       }        
     
    if (comms.s_account == " " || comms.s_account == "" ){
      comms.s_account1 = '--';
      comms.s_account2 = '--';
    } else {
      // 取汉字与数字
      comms.s_account1 = comms.s_account.match(/[\u4e00-\u9fa5]/g).join("");
      comms.s_account2 = comms.s_account.match(/\d+/g); 
    }       
    // 存入数据
    this.setData({
      listData:comms,
      bx_listData: rs.data.baoxiao,
    });
    // 取消等待
    setTimeout(function () {
      wx.hideLoading()
    });
  }
  
})
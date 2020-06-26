// 手动添加发票
const util = require('../../../utils/util.js');
const regeneratorRuntime = require('../../../module/runtime.js')
const billApi = require('../../../api/billApi.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['增值税专用发票', '增值税普通发票', '增值税普通发票(电子)', '增值税普通发票(卷式)'],
    objectArray: [{
        id: 0,
        name: '请选择发票类型'
      },
      {
        id: 1,
        name: '增值税专用发票'
      },
      {
        id: 2,
        name: '增值税普通发票'
      },
      {
        id: 3,
        name: '增值税普通发票(电子)'
      },
      {
        id: 4,
        name: '增值税普通发票(卷式)'
      }
    ],
    index: '0',
    invoice_type: '', // 发票类型
    invoice_no: '', // 发票编号
    invoice_code: '', // 发票代码
    invoice_money: '', // 发票金额
    date: '请选择开票日期', // 开票日期
    invoice_check_code: '', // 效验码
    contract_code:'', // 合同编号
    contract_name:'', // 合同名称
    showViews: true, // 控制显示和隐藏
    showView: true,
    t: '/images/icon/timg.jpg',
    f: '',
    quanxian:[]  // 权限

  },

  // 发票类型
  bindPickerChange: function(e) {
    console.log('发票类型携带值为', e.detail.value)
    let s = e.detail.value;
    s == 0 ? s = '01' : s == 1 ? s = '04' : s == 2 ? s = '10' : s == 3 ? s = '11' : '';
    this.setData({
      index: e.detail.value,
      invoice_type: s,
      showViews: false
    })
    console.log(this.data.invoice_type);
  },

  // 开票日期
  bindDateChange: function(e) {
    console.log('日期携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      showView: false,
    })
  },

  // 发票号码
  onInput1: function(e) {
    console.log("发票号码==", e.detail.value);
    this.setData({
      invoice_no: e.detail.value,
    })
  },

  // 发票代码
  onInput2: function(e) {
    console.log("发票代码==", e.detail.value);
    this.setData({
      invoice_code: e.detail.value,
    })
  },

  // 效验码后6位
  onInput3: function(e) {
    console.log("效验码后6位==", e.detail.value);
    this.setData({
      invoice_check_code: e.detail.value
    })
  },

  // 发票金额
  onInput4: function(e) {
    console.log("发票金额==", e.detail.value);
    this.setData({
      invoice_money: e.detail.value,
    })
  },

  // 查找发票
  ok: function(e) {
    if (this.data.index == 0) {
      if (this.data.invoice_type == '' || this.data.invoice_no == '' || this.data.invoice_code == '' || this.data.invoice_money == '' || this.data.date == '请选择开票日期') {
        wx.showToast({
          title: '不能为空 !',
          image: '../../../images/icon/jinggao.png',
          duration: 2000
        })
      } else {
        wx.showLoading({
          title: '正在查询...',
        });
        this.addInvoice()
      }
    } else {
      if (this.data.invoice_type == '' || this.data.invoice_no == '' || this.data.invoice_code == '' || this.data.invoice_check_code == '' || this.data.date == '请选择开票日期') {
        wx.showToast({
          title: '不能为空 !',
          image: '../../../images/icon/jinggao.png',
          duration: 2000
        })
      } else {
        wx.showLoading({
          title: '正在查询...',
        });
        this.addInvoice()
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let contract_code = options.c_code;
    let contract_name = options.c_name;
    let qx = app.globalData.quanxian;
    this.setData({
      contract_code: contract_code,
      contract_name: contract_name,
      quanxian:qx
    })
    showViews: (options.showView == "true" ? true : false)
    showView: (options.showView == "true" ? true : false)
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

  // 根据所传发票号码判断数据库中是否存在该发票
  async findOneInvoiceList() {
    let res = await billApi.findOneInvoiceList({
      invoice_no_short: this.data.invoice_no,
      invoice_code: this.data.invoice_code,
    });
    const v = res.data;
    console.log("res",res);
    console.log("sssss",v[0].contract_id);
    const qx = this.data.quanxian[0].authority;
    // 看数据库中是否已存在
    if (res.code == 0) {
      if (res.data != "") {
        // 若存在 则根据权限以及发票状态进行相应跳转
        // 发票已关联合同或报销，且已通过，进入已通过的发票详情页面，此页面不用区分权限操作
        if (v[0].contract_id != '' && v[0].audit_status == 1) {
          wx.navigateTo({
            url: '../bill-details/bill-details?no=' + this.data.invoice_no + '&code=' + this.data.invoice_code
          })
        } // 若发票未关联或已驳回 跳转到提交审核页面
        else if (v[0].contract_id == '' || v[0].contract_id == undefined || v[0].audit_status == 2) {
          wx.navigateTo({
            url: '../../../packageB/pages/contract-bill-commit/contract-bill-commit?&bill_number=' + this.data.invoice_no + '&bill_id=' + this.data.invoice_code + '&contract_code=' + this.data.contract_code + '&contract_name=' + this.data.contract_name
          })
        } // 若发票已关联，但却未审核,则跳到待审核页面，此页面不用区分权限操作
        else if ((v[0].contract_id != '' && v[0].contract_id != undefined )|| v[0].audit_status == 0) {
          wx.navigateTo({
            url: '../bill-scan-add-wait/bill-scan-add-wait?&no=' + this.data.invoice_no + '&code=' + this.data.invoice_code
          })
        }
      } // 不存在 则新增，并跳转到提交审核页面
      else {
        wx.navigateTo({
          url: '../../../../packageB/pages/contract-bill-commit/contract-bill-commit?&bill_number=' + this.data.invoice_no + '&bill_id=' + this.data.invoice_code + '&contract_code=' + this.data.contract_code + '&contract_name=' + this.data.contract_name
        })
      }
    } else {
      wx.showToast({
        title: '扫描失败！',
        image: '../../images/icon/jinggao.png',
        duration: 3000,
      })
    }
  },

  // 调用发票接口看是否查到数据
  async addInvoice() {
    let rs = await billApi.addInvoice({
      bill_type: this.data.invoice_type,
      bill_number: this.data.invoice_no,
      bill_id: this.data.invoice_code,
      bill_xy_id: this.data.invoice_check_code,
      bill_money: this.data.invoice_money,
      bill_time: this.data.date,
    });
    console.log("请求新增结果", rs);
    if (rs.code == 0 || rs.code == 3 || rs.code =="4"){
      setTimeout(function () {
        wx.hideLoading()
      });
      
      this.findOneInvoiceList();
    }  else {
      wx.showToast({
        title: rs.msg,
        icon: 'none',
        duration: 3000,
      })
    }
  },

})
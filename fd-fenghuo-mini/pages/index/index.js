const util = require('../../utils/util.js');
const regeneratorRuntime = require('../../module/runtime.js')
const billApi = require('../../api/billApi.js');
const control_centerApi = require('../../api/control_centerApi.js');
const app = getApp();

Page({
  data: {
    invoice_data: [], // 发票所有信息
    invoice_type: '', // 发票类型
    invoice_no: '', // 发票编号
    invoice_code: '', // 发票代码
    invoice_money: '', // 发票金额
    invoice_createTime: '', // 发票创建时间
    invoice_check_code: '', // 发票效验码
    // monthInvoice_number: '', // 本月新增
    // yearInvoice_number: '', // 当年累计
    // waitInvoice_number: '', // 当月待处理
    waitInvoice: '', // 待审核
    passInvoice: '', // 已通过
    noPassInovice: '', // 已驳回
    username: '', // 用户名
    company_name: '', // 公司名称
    quanxian: [] ,// 权限控制，用于处理页面
    qrcode:''
  },
  // 扫描二维码
  addBill: function() {
    wx.scanCode({
      scanType: ['qrCode'],
      success: (res) => {
        console.log("res", res)
        var result = res.result; // 扫描结果应为 01,04,031001900104,30219873,190.93,20190918,64655793082041080490,7EC0,
        // 转换为数组来操作  
        var arr = new Array;
        arr = result.split(",");
        console.log("arr",arr);
        if(arr.length == 7 || arr.length == 10){
          wx.showToast({
            title: '发票类型不正确！',
            icon: 'none',
            duration: 3000,
          })
        }else if(arr.length < 7 || arr.length >11){
          wx.showToast({
            title: '请扫描正确的发票二维码！',
            icon: 'none',
            duration: 3000,
          })
        }else{
        // 得到需要传的参数值
        var result0 = arr[1]; // 发票类型
        var result1 = arr[2]; // 发票代码
        var result2 = arr[3]; // 发票号码 
        var result3 = arr[4]; // 发票金额
        var result4 = arr[5].substring(0, 4) + '-' + arr[5].substring(6, 4) + '-' + arr[5].substring(8, 6); // 发票时间
        var result5 = arr[6].substring(14); // 效验码
        this.setData({
          invoice_type: result0,
          invoice_code: result1,
          invoice_no: result2,
          invoice_money: result3,
          invoice_createTime: result4,
          invoice_check_code: result5
        });
        wx.showLoading({
          title: '正在查询...',
        });
        this.addInvoice();
      }
    }
    })
  },

  /**
   * 用户中心
   */
  toUserData: function() {
    wx.navigateTo({
      url: '/pages/user-center/user-center?username=' + this.data.username + '&company_name=' + this.data.company_name,
    })
  },

  /**
   * 发票列表
   */
  billManage: function() {
    wx.navigateTo({
      url: '../../packageA/pages/bill-manage/bill-manage',
    })
  },

  /**
   * 合同列表
   */
  contractManage: function() {
    wx.navigateTo({
      url: '../../packageB/pages/contract-manage/contract-manage',
    })
  },

  /**
   * 报销记录
   */
  expendRecordManage: function() {
    wx.navigateTo({
      url: '../../packageC/pages/expend-record/expend-record',
    })
  
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var quanxian = wx.getStorageSync('quanxian') || [];
    var username = wx.getStorageSync('username') || [];
    this.setData({
      username: username,
      quanxian: quanxian
    })
    this.getUserCompanyName();
    this.getPassInvoice();
    this.getNoPassInvoice();
    this.getWaitInvoice();
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
    console.log("data", res.data);
    const qx = this.data.quanxian[0].authority;
    // 看数据库中是否已存在
    if (res.code == 0) {
      if (res.data != "") {
        // 若存在 则根据权限以及发票状态进行相应跳转
        // 发票已关联合同或报销，且已通过，进入已通过的发票详情页面，此页面不用区分权限操作
        if (v[0].contract_id != '' && v[0].audit_status == 1) {
          wx.navigateTo({
            url: '../../packageA/pages/bill-details/bill-details?no=' + this.data.invoice_no + '&code=' + this.data.invoice_code
          })
        } // 若发票未关联或已驳回
        else if (v[0].contract_id == '' || v[0].contract_id == undefined || v[0].audit_status == 2) {
          // 根据权限跳到相应的发票信息页面
          if (qx == 'ROLE_COMMON') {
            // 普通用户
            wx.navigateTo({
              url: '../../packageA/pages/bill-scan-add-common/bill-scan-add-common?bill_type=' + this.data.invoice_type + '&bill_number=' + this.data.invoice_no + '&bill_id=' + this.data.invoice_code + '&bill_xy_id=' + this.data.invoice_check_code + '&bill_money=' + this.data.invoice_money + '&bill_time=' + this.data.invoice_createTime
            })
          } else {
            // 其他用户
            wx.navigateTo({
              url: '../../packageA/pages/bill-scan-add-leader/bill-scan-add-leader?bill_type=' + this.data.invoice_type + '&bill_number=' + this.data.invoice_no + '&bill_id=' + this.data.invoice_code + '&bill_xy_id=' + this.data.invoice_check_code + '&bill_money=' + this.data.invoice_money + '&bill_time=' + this.data.invoice_createTime
            })
          }

        } // 若发票已关联，但却未审核,则跳到待审核页面，此页面不用区分权限操作
        else if ((v[0].contract_id != '' && v[0].contract_id != undefined) || v[0].audit_status == 0) {
          wx.navigateTo({
            url: '../../packageA/pages/bill-scan-add-wait/bill-scan-add-wait?&no=' + this.data.invoice_no + '&code=' + this.data.invoice_code
          })
        }
      } // 不存在 则新增，并根据权限跳转
      else if (qx == 'ROLE_COMMON') {
        // 普通用户
        wx.navigateTo({
          url: '../../packageA/pages/bill-scan-add-common/bill-scan-add-common?bill_type=' + this.data.invoice_type + '&bill_number=' + this.data.invoice_no + '&bill_id=' + this.data.invoice_code + '&bill_xy_id=' + this.data.invoice_check_code + '&bill_money=' + this.data.invoice_money + '&bill_time=' + this.data.invoice_createTime
        })
      } else {
        // 其他用户
        wx.navigateTo({
          url: '../../packageA/pages/bill-scan-add-leader/bill-scan-add-leader?bill_type=' + this.data.invoice_type + '&bill_number=' + this.data.invoice_no + '&bill_id=' + this.data.invoice_code + '&bill_xy_id=' + this.data.invoice_check_code + '&bill_money=' + this.data.invoice_money + '&bill_time=' + this.data.invoice_createTime
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
      bill_time: this.data.invoice_createTime,
    });
    console.log("请求新增结果", rs);
    if (rs.code == 0 || rs.code == 3 || rs.code == 4) {
      setTimeout(function() {
        wx.hideLoading()
      });
      this.setData({
        invoice_data: rs.data,
      })
      this.findOneInvoiceList();
    } else {
      wx.showToast({
        title: rs.msg,
        icon: 'none',
        duration: 3000,
      })
    }
  },

  /**
   * 获取用户公司名称
   */
  async getUserCompanyName() {
    let rs = await control_centerApi.getUserCompanyName({
      username: this.data.username
    })
    console.log("company_name", rs);
    if(rs.statusCode == "403"){
      wx.showToast({
        title: "网络连接超时，请重新登录!",
        icon: 'none',
        duration: 3000,
      })
      wx.removeStorage({
        key: 'userToken',
        success(res) {
          wx.removeStorage({
            key: 'userpsd',
            success(res) {
              wx.reLaunch({
                url: '/pages/login/login',
              })
            }
          })
        }
      })
    }
    this.setData({
      company_name: rs.data.company_name
    })
    // this.getInvoiceDate1();
  },

  // /**
  //  * 得到当月当年的票据数据
  //  */
  // async getInvoiceDate1() {
  //   let rs = await control_centerApi.InvoiceCountAll1({
  //     company_name: this.data.company_name
  //   })
  //   console.log("当月发票请求结果", rs);
  //   this.setData({
  //     monthInvoice_number: rs.data.addInvoice.m_time,
  //     yearInvoice_number: rs.data.addInvoice.y_time
  //   })
  // },

  // /**
  //  * 得到已处理/待处理的票据数据
  //  */
  // async getInvoiceDate2() {
  //   let rs = await control_centerApi.InvoiceCountAll2({
  //   })
  //   console.log("已/待发票请求结果", rs);
  //   this.setData({
  //     waitInvoice_number: rs.data.invoiceUnFinishCount[0].count
  //   })
  // },

  /**
   * 得到待审核的票据数据
   */
  async getWaitInvoice() {
    var qx = app.globalData.quanxian;
    // 普通用户或主管，只看自己的发票记录
    if (qx[0].authority == "ROLE_COMMON" || qx[0].authority == "ROLE_DIRECTOR") {
      var user_id = app.globalData.user_id
      let rs = await control_centerApi.getInvoice({
        user_id: user_id,
        audit_status: 0
      })
      console.log("待审核发票的请求结果", rs);
      this.setData({
        waitInvoice: rs.data.number
      })
    } else {
      let rs = await control_centerApi.getInvoice({
        audit_status: 0
      })
      console.log("待审核发票的请求结果", rs);
      this.setData({
        waitInvoice: rs.data.number
      })
    }
  },

  /**
   * 得到已通过的票据数据
   */
  async getPassInvoice() {
    var qx = app.globalData.quanxian;
    // 普通用户或主管，只看自己的发票记录
    if (qx[0].authority == "ROLE_COMMON" || qx[0].authority == "ROLE_DIRECTOR") {
      var user_id = app.globalData.user_id;
      let rs = await control_centerApi.getInvoice({
        user_id: user_id,
        audit_status: 1
      })
      console.log("已通过发票的请求结果", rs);
      this.setData({
        passInvoice: rs.data.number
      })
    } else {
      let rs = await control_centerApi.getInvoice({
        audit_status: 1
      })
      console.log("已通过发票的请求结果", rs);
      this.setData({
        passInvoice: rs.data.number
      })
    }

  },

  /**
   * 得到已驳回的票据数据
   */
  async getNoPassInvoice() {
    var qx = app.globalData.quanxian;
    // 普通用户或主管，只看自己的发票记录
    if (qx[0].authority == "ROLE_COMMON" || qx[0].authority == "ROLE_DIRECTOR") {
      var user_id = app.globalData.user_id;
    } else {
      var user_id = '';
    }
    let rs = await control_centerApi.getInvoice({
      user_id: user_id,
      audit_status: 2
    })
    console.log("已驳回发票的请求结果", rs);
    this.setData({
      noPassInvoice: rs.data.number
    })

  },




})
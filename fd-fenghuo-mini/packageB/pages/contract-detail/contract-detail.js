// 合同发票记录
const regeneratorRuntime = require('../../../module/runtime.js')
const contractApi = require('../../../api/contractApi.js');
const billApi = require('../../../api/billApi.js');
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_id: 1, // 公司id
    contract_code: '', // 合同编号
    contract_name: '', // 合同名称
    listData: [], // 合同详情数据
    invoiceListData: [], // 合同下的发票信息
    invoice_data: [], // 发票所有信息
    invoice_type: '', // 发票类型
    invoice_no: '', // 发票编号
    invoice_code: '', // 发票代码
    invoice_money: '', // 发票金额
    invoice_createTime: '', // 发票创建时间
    invoice_check_code: '', // 发票效验码
    quanxian:[] // 权限
  },

  // 跳转到发票详情
  invoiceDetail: function(e) {
    let no = e.currentTarget.dataset.index1;
    let code = e.currentTarget.dataset.index2;
    let audit_status = e.currentTarget.dataset.index3;
    // 待审核
    console.log("audit_status", audit_status);
    if (audit_status == 0){
      wx.navigateTo({
        url: '../../../packageA/pages/bill-scan-add-wait/bill-scan-add-wait?no=' + no + '&code=' + code
      });
    } else if (audit_status == 1){
      // 已通过
      wx.navigateTo({
        url: '../../../packageA/pages/bill-details/bill-details?no=' + no + '&code=' + code
      });
    }else{
      // 已驳回
      wx.navigateTo({
        url: '../../../packageA/pages/bill-nopass-details/bill-nopass-details?no=' + no + '&code=' + code
      });
    }
    
  },

  // 扫码添加发票
  scanAdd: function() {
    wx.scanCode({
      scanType: ['qrCode'],
      success: (res) => {
        console.log("res", res)
        var result = res.result; // 扫描结果应为 01,04,031001900104,30219873,190.93,20190918,64655793082041080490,7EC0,
        // 转换为数组来操作  
        var arr = new Array;
        arr = result.split(",");
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
      },
    })
  },

  // 手动添加发票
  manageAdd: function() {
    wx.navigateTo({
      url: '../../../packageA/pages/bill-manual-add/bill-manual-add?c_code='+this.data.contract_code+'&c_name='+this.data.contract_name
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });
    // 接到参数
    let contract_code = options.contract_code;
    let contract_name = options.contract_name;
    this.setData({
      contract_code: contract_code,
      contract_name: contract_name,
      quanxian: app.globalData.quanxian
    });
    this.contractDetail();
    this.contractInvoice();
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
    console.log("当前合同detail页面栈", pages);
    if (pages.length > 3) {
      if (pages[3].route == 'packageA/pages/bill-details/bill-details') {
        wx.navigateBack({
          delta: 2,
          success: function () {
            pages[1].onLoad(); // 执行需要返回页面的onLoad方法
          }
        })
      }else if (pages.length == 4 && pages[3].route == 'packageB/pages/contract-detail/contract-detail') {
        
      }// 合同列表 -> 合同详情 -> 手动添加 -> 已存在且已关联的发票 -> 合同详情
      else if (pages.length == 6 && pages[3].route == 'packageA/pages/bill-manual-add/bill-manual-add') {
        
      }// 发票列表 -> 发票详情  -> 合同详情-> 发票详情  -> 合同详情
      else if (pages.length == 6 && pages[5].route == 'packageB/pages/contract-detail/contract-detail') {
        wx.navigateBack({
          delta:2,  
        })
      } else {
        wx.navigateBack({
          delta: pages.length + 1,
          success: function () {
            pages[0].onLoad(); // 执行需要返回页面的onLoad方法
          }
        })
      }
    }
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

  /**
   * 获取合同数据
   */
  async contractDetail() {
    let rs = await contractApi.contractDetail({
      code: this.data.contract_code,
      name: this.data.contract_name,
      company_id: this.data.company_id
    })
    console.log('shuju', rs);
    // 设置时间格式   
    let comms = rs.data
    console.log(comms)
    if (comms.contract.create_time != "") {
      let time = comms.contract.create_time.replace(/\-/g, "/");
      comms.contract.create_time = time.substring(0, 10);
    }
    this.setData({
      listData: comms
    })
    // 取消等待
    setTimeout(function() {
      wx.hideLoading()
    });
  },

  // 获取合同下的发票列表
  async contractInvoice() {
    let res = await contractApi.contractInvoice({
      name: this.data.contract_name
    })
    console.log("返回结果", res);
    let comms = res.data;
    for (let i in comms) {
      let time = comms[i].invoice_time.replace(/\-/g, "/");
      comms[i].invoice_time = time.substring(0, 10);
    }
    this.setData({
      invoiceListData: comms,
      totalSize: res.data.length
    });
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
            url: '../../../packageA/pages/bill-details/bill-details?no=' + this.data.invoice_no + '&code=' + this.data.invoice_code
          })
        } // 若发票未关联或已驳回 跳转到提交审核页面
        else if (v[0].contract_id == '' || v[0].contract_id == undefined || v[0].audit_status == 2) {         
            wx.navigateTo({
              url: '../contract-bill-commit/contract-bill-commit?&bill_number=' + this.data.invoice_no + '&bill_id=' + this.data.invoice_code +'&contract_code='+this.data.contract_code+'&contract_name='+this.data.contract_name
            })
        } // 若发票已关联，但却未审核,则跳到待审核页面，此页面不用区分权限操作
        else if ((v[0].contract_id != '' && v[0].contract_id != undefined ) || v[0].audit_status == 0) {
          wx.navigateTo({
            url: '../../../packageA/pages/bill-scan-add-wait/bill-scan-add-wait?&no=' + this.data.invoice_no + '&code=' + this.data.invoice_code
          })
        }
      } // 不存在 则新增，并跳转到提交审核页面
      else  {
        wx.navigateTo({
          url: '../contract-bill-commit/contract-bill-commit?&bill_number=' + this.data.invoice_no + '&bill_id=' + this.data.invoice_code + '&contract_code=' + this.data.contract_code + '&contract_name=' + this.data.contract_name
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
      setTimeout(function () {
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

})
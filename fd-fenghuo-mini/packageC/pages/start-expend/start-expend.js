const regeneratorRuntime = require('../../../module/runtime.js')
const expendApi = require('../../../api/expendApi.js');
const billApi = require('../../../api/billApi.js');
var util = require('../../../utils/util.js');
const config = require('../../../config/config.js');
const app = getApp();
// 我要报销
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array1: [], // 报销项目名称
    array11: [], // 报销项目ID
    array2: [], // 报销类别
    array22: [], // 报销类别type
    projectValue: '', // 用户所选的项目id
    projectName: '', // 用户所选的项目名称
    typeValue: '', // 用户所选的报销类别type
    typeName: '', // 所选类别名称
    showViews: true, // 控制显示和隐藏
    showViews2: true,
    moneyValue: '', // 报销金额
    beizhuValue: '', // 备注说明
    bz_size:'',  // 备注字数
    invoiceListData: [], // 发票列表
    invoice_type: '', // 发票类型
    invoice_no: '', // 发票编号
    invoice_code: '', // 发票代码
    invoice_money: '', // 发票金额
    invoice_createTime: '', // 发票创建时间
    invoice_check_code: '', // 发票效验码
    quanxian: [], // 权限
    bx_list: [], // 全局中的报销信息
    fileList: [], // 所选上传图片,
    option: {
      url: "/common/file/upload",
      host: config.server.springboot,
      miniType: "",
      warming: {
        txt: "最多上传8张",
      },
      addIcon: 2
    },
  },

  // 报销项目 用户的选择结果
  bindPickerChange1: function(e) {
    for (let i in this.data.array11) {
      if (i = e.detail.value) {
        this.setData({
          index1: i,
          projectValue: this.data.array11[i],
          showViews: false
        })
      }
    }
    for (let i in this.data.array1) {
      if (i = e.detail.value) {
        this.setData({
          index1: i,
          projectName: this.data.array1[i],
          showViews: false
        })
      }
    }
    console.log('报销项目id值为', this.data.projectValue)
    console.log('报销项目name值为', this.data.projectName)
  },
  // 报销类别 用户的选择结果
  bindPickerChange2: function(e) {
    for (let i in this.data.array22) {
      if (i = e.detail.value) {
        this.setData({
          index2: i,
          typeValue: this.data.array22[i],
          showViews2: false
        })
      }
    }
    for (let i in this.data.array2) {
      if (i = e.detail.value) {
        this.setData({
          index2: i,
          typeName: this.data.array2[i],
          showViews2: false
        })
      }
    }
    console.log('报销类别type值为', this.data.typeValue)
    console.log('报销类别name值为', this.data.typeName)
  },
  // 报销金额
  bindMoney: function(e) {
    console.log('报销金额值为', e.detail.value)
    let text = (Number)(e.detail.value);
    if((/^\d+(\.\d{1,2})?$/.test(text ) || /^\d$/.test(text ) )){  
      this.setData({
        moneyValue: text.toFixed(2),        
      })
    } else { 
      wx.showToast({
        title: '保留两位小数!',
        image: '../../../images/icon/jinggao.png',
        duration: 1000
      })
      this.setData({
        moneyValue: text.toFixed(2),        
      })
    }
  },
  // 备注说明
  bindBeizhu: function(e) {
    console.log('备注说明值为', e.detail.value);
    this.setData({
      beizhuValue: e.detail.value,
      bz_size: e.detail.value.length
    })
  },
  // 图片上传
  getValue: function(e) {
    let value = e.detail.value; // 自定义组件触发事件时提供的detail对象
    console.log("filevalue=", value);
    this.setData({
      fileList: value.imgs
    })
  },
  // 扫码添加
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
  // 手动添加
  manageAdd: function() {
    var _t = this.data;
    // 若是第一次进来，不存在全局信息时
    if (_t.bx_list == '') {
      let arr = [{
        "bx_project_id": _t.projectValue,
        "bx_project_name": _t.projectName,
        "bx_type_code": _t.typeValue,
        "bx_type_name": _t.typeName,
        "bx_money": _t.moneyValue,
        "bx_beizhu": _t.beizhuValue,
        "file": _t.fileList
      }];
      app.globalData.bx_list = arr;
    } else {
      // 不是第一次进来，已经存在全局信息，则把以前的信息添加进去
      // 判断有没有中途新添的内容
      if (_t.beizhuValue != '') {
        let arr = [{
          "bx_project_id": _t.bx_list[0].bx_project_id,
          "bx_project_name": _t.bx_list[0].bx_project_name,
          "bx_type_code": _t.bx_list[0].bx_type_code,
          "bx_type_name": _t.bx_list[0].bx_type_name,
          "bx_money": _t.bx_list[0].bx_money,
          "bx_beizhu": _t.beizhuValue,
          "file": _t.bx_list[0].file
        }];
        app.globalData.bx_list = arr;
      } else if (_t.fileList != '') {
        let arr = [{
          "bx_project_id": _t.bx_list[0].bx_project_id,
          "bx_project_name": _t.bx_list[0].bx_project_name,
          "bx_type_code": _t.bx_list[0].bx_type_code,
          "bx_type_name": _t.bx_list[0].bx_type_name,
          "bx_money": _t.bx_list[0].bx_money,
          "bx_beizhu": _t.bx_list[0].bx_beizhu,
          "file": _t.fileList
        }];
        app.globalData.bx_list = arr;
      } else if (_t.beizhuValue != '' && _t.fileList != '') {
        let arr = [{
          "bx_project_id": _t.bx_list[0].bx_project_id,
          "bx_project_name": _t.bx_list[0].bx_project_name,
          "bx_type_code": _t.bx_list[0].bx_type_code,
          "bx_type_name": _t.bx_list[0].bx_type_name,
          "bx_money": _t.bx_list[0].bx_money,
          "bx_beizhu": _t.beizhuValue,
          "file": _t.fileList
        }];
        app.globalData.bx_list = arr;
      }
    }
    console.log("bx_list", app.globalData.bx_list);

    wx.navigateTo({
      url: '../manual-add/manual-add'
    });
  },
  // 查看发票详情
  invoiceDetail: function(e) {
    let no = e.currentTarget.dataset.index1;
    let code = e.currentTarget.dataset.index2;
    var _t = this.data;
    // 若是第一次进来，不存在全局信息时
    if (_t.bx_list == '') {
      let arr = [{
        "bx_project_id": _t.projectValue,
        "bx_project_name": _t.projectName,
        "bx_type_code": _t.typeValue,
        "bx_type_name": _t.typeName,
        "bx_money": _t.moneyValue,
        "bx_beizhu": _t.beizhuValue,
        "file": _t.fileList
      }];
      app.globalData.bx_list = arr;
    } else {
      // 不是第一次进来，已经存在全局信息，则把以前的信息添加进去
      // 判断有没有中途新添的内容
      if (_t.beizhuValue != '') {
        let arr = [{
          "bx_project_id": _t.bx_list[0].bx_project_id,
          "bx_project_name": _t.bx_list[0].bx_project_name,
          "bx_type_code": _t.bx_list[0].bx_type_code,
          "bx_type_name": _t.bx_list[0].bx_type_name,
          "bx_money": _t.bx_list[0].bx_money,
          "bx_beizhu": _t.beizhuValue,
          "file": _t.bx_list[0].file
        }];
        app.globalData.bx_list = arr;
      } else if (_t.fileList != '') {
        let arr = [{
          "bx_project_id": _t.bx_list[0].bx_project_id,
          "bx_project_name": _t.bx_list[0].bx_project_name,
          "bx_type_code": _t.bx_list[0].bx_type_code,
          "bx_type_name": _t.bx_list[0].bx_type_name,
          "bx_money": _t.bx_list[0].bx_money,
          "bx_beizhu": _t.bx_list[0].bx_beizhu,
          "file": _t.fileList
        }];
        app.globalData.bx_list = arr;
      } else if (_t.beizhuValue != '' && _t.fileList != '') {
        let arr = [{
          "bx_project_id": _t.bx_list[0].bx_project_id,
          "bx_project_name": _t.bx_list[0].bx_project_name,
          "bx_type_code": _t.bx_list[0].bx_type_code,
          "bx_type_name": _t.bx_list[0].bx_type_name,
          "bx_money": _t.bx_list[0].bx_money,
          "bx_beizhu": _t.beizhuValue,
          "file": _t.fileList
        }];
        app.globalData.bx_list = arr;
      }
    }
    console.log("bx_list", app.globalData.bx_list);

    wx.navigateTo({
      url: '../../../packageA/pages/bill-nopass-details/bill-nopass-details?no=' + no + '&code=' + code,
    })
  },
  // 删除发票
  deleteInvoice: function(e) {
    let arr = app.globalData.expendInvoice;
    let no = e.currentTarget.dataset.index1;
    let code = e.currentTarget.dataset.index2;
    console.log("arr1", arr);
    console.log("aaaa", no,code);
    for (let i in arr) {
      if (no == arr[i].invoice_no_short && code == arr[i].invoice_code) {
        arr.splice(i);
        console.log("arr2",arr);
        app.globalData.expendInvoice == arr;
      }
    }
    this.setData({
      invoiceListData: arr,
    })
    console.log("删除后", app.globalData.expendInvoice);
  },

  // 提交审核按钮
  bindExpend: function() {
    var _t = this.data;
    if (_t.bx_list == '') {          
      if (_t.projectValue == '' || _t.typeValue == '' || _t.moneyValue == '') {
        wx.showToast({
          title: '必填项不能为空!',
          image: '../../../images/icon/jinggao.png',
          duration: 2000
        })
      }else if (_t.invoiceListData == '') {
        wx.showToast({
          title: '发票不能为空!',
          image: '../../../images/icon/jinggao.png',
          duration: 2000
        })
      } else {
        this.addExpend();
      }
    } else {
      if ((_t.bx_list[0].bx_project_id == '' && _t.projectValue =='') || (_t.bx_list[0].bx_type_code == '' && _t.typeValue == '') || (_t.bx_list[0].bx_money == '' && _t.moneyValue == '')) {
        wx.showToast({
          title: '必填项不能为空!',
          image: '../../../images/icon/jinggao.png',
          duration: 2000
        })
      }else if (_t.invoiceListData == '') {
        wx.showToast({
          title: '发票不能为空!',
          image: '../../../images/icon/jinggao.png',
          duration: 2000
        })
      } else {
        this.addExpend();
      }
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let qx = app.globalData.quanxian;
    let arr = app.globalData.expendInvoice;
    let bx_arr = app.globalData.bx_list;
    if (bx_arr!=''){
      var bx_bz_size = app.globalData.bx_list[0].bx_beizhu.length;
    }   
    this.setData({
      invoiceListData: arr,
      bx_list: bx_arr,
      bz_size: bx_bz_size,
      quanxian: qx
    })
    this.getExpendProject();
    this.getExpendType();
    app.disposePostToken();

    console.log("报销发票", arr);
    console.log("报销信息", bx_arr);
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
    // 清除全局数据
    let arr = new Array;
    app.globalData.expendInvoice = arr;
    app.globalData.bx_list = arr;
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
   *  获得报销项目列表
   */
  async getExpendProject() {
    var quanxian = wx.getStorageSync('quanxian') || [];
    // 权限控制要传的参数，来达到控制显示内容的目的.
    // 主管角色
    if (quanxian[0].authority == 'ROLE_COMMON' || quanxian[0].authority == 'ROLE_DIRECTOR') {
      var user_id = app.globalData.user_id;
    } else {
      var user_id = '';
    }
    let rs = await expendApi.getExpendProject({
      user_id: user_id
    })
    console.log("返回报销项目结果", rs);
    let arr1 = []; // 存项目名称
    let arr2 = []; // 存项目id
    for (let i in rs.data) {
      let project = rs.data[i].project_name;
      arr1.push(project);
      let p_id = rs.data[i].p_id;
      arr2.push(p_id);
    }
    this.setData({
      array1: arr1,
      array11: arr2
    })
    console.log("项目名称", this.data.array1);
    console.log("项目id", this.data.array11);

  },
  // 获取报销类别
  async getExpendType() {
    var quanxian = wx.getStorageSync('quanxian') || [];
    let rs = await expendApi.getExpendType({

    })
    console.log("返回报销类别结果", rs);
    let arr1 = [];
    let arr2 = [];
    for (let i in rs.data) {
      let type_name = rs.data[i].type_name;
      arr1.push(type_name);
      let type_code = rs.data[i].type_code;
      arr2.push(type_code);
    }
    this.setData({
      array2: arr1,
      array22: arr2
    })
    console.log("报销名称", this.data.array2);
    console.log("报销code", this.data.array22);
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
      // this.setData({
      //   listData: rs.data,
      // })
      this.findOneInvoiceList();
    } else {
      wx.showToast({
        title: rs.msg,
        icon: 'none',
        duration: 3000,
      })
    }
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
        } // 若发票未关联或已驳回  跳转到确认报销页面
        else if (v[0].contract_id == '' || v[0].contract_id == undefined || v[0].audit_status == 2) {
          if (this.data.bx_list == '') {
            let arr = [{
              "bx_project_id": this.data.projectValue,
              "bx_project_name": this.data.projectName,
              "bx_type_code": this.data.typeValue,
              "bx_type_name": this.data.typeName,
              "bx_money": this.data.moneyValue,
              "bx_beizhu": this.data.beizhuValue,
              "file": this.data.fileList
            }];
            app.globalData.bx_list = arr;
          } else {
            if (this.data.beizhuValue != '') {
              let arr = [{
                "bx_project_id": this.data.bx_list[0].bx_project_id,
                "bx_project_name": this.data.bx_list[0].bx_project_name,
                "bx_type_code": this.data.bx_list[0].bx_type_code,
                "bx_type_name": this.data.bx_list[0].bx_type_name,
                "bx_money": this.data.bx_list[0].bx_money,
                "bx_beizhu": this.data.beizhuValue,
                "file": this.data.bx_list[0].file
              }];
              app.globalData.bx_list = arr;
            } else if (this.data.fileList != '') {
              let arr = [{
                "bx_project_id": this.data.bx_list[0].bx_project_id,
                "bx_project_name": this.data.bx_list[0].bx_project_name,
                "bx_type_code": this.data.bx_list[0].bx_type_code,
                "bx_type_name": this.data.bx_list[0].bx_type_name,
                "bx_money": this.data.bx_list[0].bx_money,
                "bx_beizhu": this.data.bx_list[0].bx_beizhu,
                "file": this.data.fileList
              }];
              app.globalData.bx_list = arr;
            } else if (this.data.beizhuValue != '' && this.data.fileList != '') {
              let arr = [{
                "bx_project_id": this.data.bx_list[0].bx_project_id,
                "bx_project_name": this.data.bx_list[0].bx_project_name,
                "bx_type_code": this.data.bx_list[0].bx_type_code,
                "bx_type_name": this.data.bx_list[0].bx_type_name,
                "bx_money": this.data.bx_list[0].bx_money,
                "bx_beizhu": this.data.beizhuValue,
                "file": this.data.fileList
              }];
              app.globalData.bx_list = arr;
            }
          }
          wx.navigateTo({
            url: '../../../packageA/pages/bill-scan-add-expend/bill-scan-add-expend?no=' + this.data.invoice_no + '&code=' + this.data.invoice_code
          })

        } // 若发票已关联，但却未审核,则跳到待审核页面，此页面不用区分权限操作
        else if ((v[0].contract_id != '' && v[0].contract_id != undefined) || v[0].audit_status == 0) {
          wx.navigateTo({
            url: '../../../packageA/pages/bill-scan-add-wait/bill-scan-add-wait?no=' + this.data.invoice_no + '&code=' + this.data.invoice_code
          })
        }
      } // 不存在 则新增，并跳转到确认报销页面
      else {
        wx.navigateTo({
          url: '../../../packageA/pages/bill-scan-add-expend/bill-scan-add-expend?no=' + this.data.invoice_no + '&code=' + this.data.invoice_code
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
  // 提交审核
  async addExpend() {
    if (this.data.bx_list == '') {
      let rs =await expendApi.addExpend({
        reimburse_name: app.globalData.user_id,
        project_code: this.data.projectValue,
        reimburse_type: this.data.typeValue,
        reimburse_money: this.data.moneyValue,
        reimburse_note: this.data.beizhuValue,
        reimburse_file: this.data.fileList,
        invoiceList: this.data.invoiceListData
      })
      console.log("返回结果1", rs);
      var bx_code = rs.data.code;
    } else {
      // 再次判断用户是否更改过报销信息
      // 报销项目
      if (this.data.projectValue != '') {
        var bx1 = this.data.projectValue
      }else{
        var bx1 = this.data.bx_list[0].bx_project_id
      }
      // 报销类别
      if (this.data.typeValue != '') {
        var bx2 = this.data.typeValue
      } else {
        var bx2 = this.data.bx_list[0].bx_type_code
      }
      // 报销金额
      if (this.data.moneyValue != '') {
        var bx3 = this.data.moneyValue
      } else {
        var bx3 = this.data.bx_list[0].bx_money
      }
      // 备注
      if (this.data.beizhuValue != '') {
        var bx4 = this.data.beizhuValue
      } else {
        var bx4 = this.data.bx_list[0].bx_beizhu
      }
      // 图片
      if (this.data.fileList != '') {
        var bx5 = this.data.fileList
        console.log("newtupian", bx5);
      } else {
        var bx5 = this.data.bx_list[0].file
      }
      console.log("上传的图片", bx5);
      let rs = await expendApi.addExpend({
        reimburse_name: app.globalData.user_id,
        project_code: bx1,
        reimburse_type: bx2,
        reimburse_money: bx3,
        reimburse_note: bx4,
        reimburse_file: bx5,
        invoiceList: this.data.invoiceListData
      })
      console.log("返回结果2", rs);
      var bx_code = rs.data.code;
    }

    // 清空全局的报销发票
    let arr = new Array;
    app.globalData.expendInvoice = arr;
    app.globalData.bx_list = arr;
   
    wx.navigateTo({
      url: '../expend-detail/expend-detail?code='+bx_code,
    })

  }

})
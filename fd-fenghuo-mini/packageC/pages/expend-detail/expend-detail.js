// 报销详情
const regeneratorRuntime = require('../../../module/runtime.js')
const expendApi = require('../../../api/expendApi.js');
var util = require('../../../utils/util.js');
const config = require('../../../config/config.js');
const innerAudioContext = wx.createInnerAudioContext();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_name: '', // 报销类型
    bx_code: '', // 报销编号
    company_id: '', // 公司ID
    listData: [], // 报销详情数据
    listFileData: [], // 附件文件
    fileUrl: [], // url列表
    name: [], // 文件名
    listFile: [], // 显示的图片列表
  },

  // 跳到发票详情
  invoiceDetail: function (e) {
    let no = e.currentTarget.dataset.index1;
    let code = e.currentTarget.dataset.index2;
    let bx_status = this.data.listData.baoxiao.bx_status;
    // 该报销通过则进入发票通过的详情页面，否则进入待审核或者驳回的页面
    if(bx_status == '1'){
      wx.navigateTo({
        url: '../../../packageA/pages/bill-details/bill-details?no=' + no + '&code=' + code
      });
    }else if(bx_status == '0'){
      wx.navigateTo({
        url: '../../../packageA/pages/bill-scan-add-wait/bill-scan-add-wait?no=' + no + '&code=' + code
      });
    }else{
      wx.navigateTo({
        url: '../../../packageA/pages/bill-nopass-details/bill-nopass-details?no=' + no + '&code=' + code
      });
    }
    
    
  },

  // 查看附件详情
  fileDetail: function (e) {
    var _this = this;
    // 获取文件url
    let fileUrl = e.currentTarget.dataset.index1;
    console.log("fileUrl", fileUrl);
    // 获取文件命名
    let name = e.currentTarget.dataset.index2;
    console.log("name", name);
    wx.showLoading({
      title: '正在下载...',
    });
    // 新建数组用于保存所下载的图片或文件，便于unlink删除
    var arr1 = [];
    wx.downloadFile({
      url: fileUrl,
      filePath: wx.env.USER_DATA_PATH + '/' + name, // 自定义路径加文件名和格式，防止出现后缀为unkown,但此路径下最多只能存10M
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log("res", res);
          let arr = new Array;
          arr.push(res.filePath);
          if (_this.data.listFile.includes(res.filePath) == true) {
            listFile: _this.listFile
          }
          else {
            _this.setData({
              listFile: [..._this.data.listFile, ...arr]
            })
          }
          let nameType = fileUrl.substring(fileUrl.lastIndexOf('.') + 1).toUpperCase();
          // 判断是否为图片
          if (nameType == "JPG" || nameType == "PNG" || nameType == "JPEG" || nameType == "GIF" || nameType == "BMP") {
            setTimeout(function () {
              wx.hideLoading()
            });
            wx.previewImage({
              current: res.filePath, // 当前显示图片的http链接
              urls: _this.data.listFile // 需要预览的图片http链接列表
            })
          } else {
            // 文档
            setTimeout(function () {
              wx.hideLoading()
            });
            wx.openDocument({
              filePath: wx.env.USER_DATA_PATH + '/' + name,
              success: function (res) {
                console.log('打开文档成功');
                arr1.push(name);
                _this.setData({
                  name: [..._this.data.name, ...arr1],
                });
              },
            })
          }
        }
      },
      fail: function () {
        wx.showToast({
          title: '文件过大，请前往PC端下载！',
          icon: "none",
          duration: 3000,
        })
      }
    })
  },

  deletestore: function () {
    // 使用unlink删除本地缓存（因为本地缓存只有10M）
    let fileMgr = wx.getFileSystemManager();
    let newArr = [...this.data.listFile];
    console.log("newArr", newArr);
    for (var i = 0; i < newArr.length; i++) {
      let names = newArr[i];
      fileMgr.unlink({
        filePath: names,
        success: function (r) {
          console.log("删除成功", r);
        },
        fail(r) {
          console.log("删除失败", r);
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type_name = options.name;
    let bx_code = options.code;
    this.setData({
      type_name: type_name,
      bx_code: bx_code
    })
    this.expendDetail();

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
    this.deletestore();
    let pages = getCurrentPages(); // 获得当前页面栈
    console.log("当前报销detail页面栈", pages);
    if (pages.length > 3) {
      if (pages[3].route == 'packageA/pages/bill-details/bill-details') {
        wx.navigateBack({
          delta: 2,
          success: function () {
            pages[1].onLoad(); // 执行需要返回页面的onLoad方法
          }
        })
      } else if (pages[3].route == 'packageC/pages/expend-detail/expend-detail') {
        if (pages.length > 4 && pages[4].route == 'packageA/pages/bill-details/bill-details') {
          wx.navigateBack({
            delta: 2,
          })
        }// 直接报销-->报销结束
      else if(pages.length == 4 ){
        console.log("sssss11");
        wx.navigateBack({
          delta: pages.length+1,
          success: function () {
            pages[0].onLoad(); // 执行需要返回页面的onLoad方法
          }
        })
      } 
      } // 首页扫码添加发票进行报销时（自带发票进去，不用在报销页面增加发票），结束页面为报销详情，返回首页      !!! 扫码添加还未测试结果页面跳转问题
      else if (pages.length == 4 && (pages[1].route == 'packageA/pages/bill-scan-add-common/bill-scan-add-common' || pages[1].route == 'packageA/pages/bill-scan-add-leader/bill-scan-add-leader')) {
        console.log("sssss");
        wx.navigateBack({
          delta: pages.length+1,
          success: function () {
            pages[0].onLoad(); // 执行需要返回页面的onLoad方法
          }
        })
      } else if (pages.length == 6 && pages[3].route == 'packageA/pages/bill-manual-add/bill-manual-add') {

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
  onPullDownRefresh: function () {

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
   * 获取报销详情数据
   */
  async expendDetail() {
    let rs = await expendApi.selectDetails({
      type_name: this.data.type_name,
      bx_code: this.data.bx_code
    })
    console.log("返回结果为：", rs);
    // 修改时间格式
    for (var i in rs.data.bx_invoice) {
      let time = rs.data.bx_invoice[i].invoice_time.replace(/\-/g, "/");
      rs.data.bx_invoice[i].invoice_time = time.substring(0, 10);
    }
    // 计算无票金额
    if (rs.data.baoxiao.price_amount != undefined) {
      let noInvoicePrice = rs.data.baoxiao.bx_money - rs.data.baoxiao.price_amount; // 报销金额 - 发票金额
        if(noInvoicePrice < 0){
          rs.data.baoxiao["nIP"] = 0
        }else{
          rs.data.baoxiao["nIP"] = noInvoicePrice.toFixed(2); // 取小数点后两位,加入结果数组中去
        }      
    } else {
      let noInvoicePrice = rs.data.baoxiao.bx_money - 0; // 报销金额 - 发票金额
        if(noInvoicePrice < 0){
          rs.data.baoxiao["nIP"] = 0
        }else{
          rs.data.baoxiao["nIP"] = noInvoicePrice.toFixed(2); // 取小数点后两位,加入结果数组中去
        }
    }
    // 显示文件
    var arr = new Array;
    arr = JSON.parse(rs.data.baoxiao.files);
    console.log("arr", arr);
    if (arr == "[]") {
      this.setData({
        listData: rs.data,
        noInvoicePrice: rs.data.baoxiao.nIP,
        listFileData: [],
        fileUrl: []
      })
    } else {
      var fileUrl = new Array;
      for (let i in fileUrl) {
        let url = app.globalData.serverurl + "/common/file/readimg?img=" + arr[i];
        fileUrl.push(url);
      }
      // 取文件名，拼接文件路径
      var file_name = new Array;
      for (let i in arr) {
        let url = config.server.springboot + "/common/file/readimg?img=" + arr[i];
        let x = arr[i].substr(arr[i].lastIndexOf('.', arr[i].lastIndexOf('.') - 1) + 1);
        if (x.length > 20) {
          let xx = x.substring(x.lastIndexOf('.') - 10);
          let f = [{
            "name": xx,
            "url": url
          }];
          file_name = [...file_name, ...f];
        } else {
          let f = [{
            "name": x,
            "url": url
          }];
          file_name = [...file_name, ...f];
        }

      }
      console.log("file_name", file_name);
      this.setData({
        listData: rs.data,
        listFileData: file_name,
        fileUrl: fileUrl
      })
    }

  }
})
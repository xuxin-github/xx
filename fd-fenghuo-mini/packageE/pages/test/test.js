// pages/service/file/index.js
Page({
  data: {
    //URL是是base64位时可以显示图片，但但download下来就有点问题
    imgSrc: 'https://cynthianc.github.io/images/wx/1484283090694.png',
    loading: false,
    showList: false,
    filesList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  downloadFile: function (e) {
    console.log(e)
    // e.currentTarget.dataset.src
    var that = this;
    that.setData({
      loading: true,
    })
    wx.downloadFile({
      url: e.currentTarget.dataset.src, //仅为示例，并非真实的资源
      success: function (res) {
        console.log('success');
        console.log(res)
        that.setData({
          src: res.tempFilePath
        })
        show('下载成功');
      },
      fail: function () {
        console.log('fail');
      },
      complete: function () {
        console.log('complete')
        that.setData({
          loading: false,
        })
      }
    })
  },
  uploadFile: function () {
    var that = this;
    console.log(that.data.src);

    //upload wx img 
    wx.uploadFile({
      url: 'https://String',//暂无可用URL
      filePath: that.data.src,
      name: 'name',
      // header: {}, // 设置请求的 header
      // formData: {}, // HTTP 请求中其他额外的 form data
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  toLocal: function () {
    /*保存到本地 */
    /*saveFile对临时路径只能保存到本地1次。再次保存该临时路径，显示saveFile:fail file not found */
    var that = this;
    var tempFilePath = that.data.src || '';//that.data.src;//res.tempFilePath
    wx.saveFile({
      tempFilePath: tempFilePath,
      success: function (res1) {
        console.log(res1);
        var savedFilePath = res1.savedFilePath
        show('保存成功')
      },
      fail: function (res) {
        console.log('fail')
        console.log(res)
        showTip();
      },
      complete: function (res) {
        console.log('complete')
        console.log(res)
      }
    })
  },
  getList: function () {
    wx.navigateTo({
      url: './files',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  openFile: function () {
    var URL = 'https://cynthianc.github.io/images/123.pdf';
    var that = this
    // wx.openDocument({
    //   filePath: 'https://cynthianc.github.io/images/123.pdf',
    //   success: function (res) {
    //     console.log('打开文档成功')
    //   },
    //   fail:function(res){
    //     console.log('fail')
    //     console.log(res)
    //   },
    //   complete: function(res) {
    //     console.log('complete')
    //     console.log(res)
    //   }
    // })
    wx.downloadFile({
      url: URL,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
            console.log(res)
            show('打开文档成功')
          },
          fail: function (res) {
            console.log('fail')
            console.log(res)
            showTip();
          },
          complete: function (res) {
            console.log('complete')
            console.log(res)
          }
        })
      },
      fail: function (res) {
        console.log('fail')
        console.log(res)
      },
      complete: function (res) {
        console.log('complete')
        console.log(res)
      }
    })
  },


})


export const show = function (tip) {
  wx.showToast({
    title: tip || '成功',
    icon: 'success',
    duration: 2000
  })
}

export const showTip = function (tip) {
  wx.showModal({
    title: '提示',
    content: tip || '操作失败！',
    showCancel: false,
  })

}
// 文件上传与下载
const regeneratorRuntime = require('../../../module/runtime.js')
//const riskApi = require('../../../api/riskApi.js');
var util = require('../../../utils/util.js');
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();      
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgfile: [], // 本地图片列表
    file: [], // 本地文件列表
    imgfiles: [], // 服务器图片列表
    path:'',  // 上传文件路径
    files: [], // 服务器文件列表
    name: [], // 文件名
  },


  // 图片上传到本地
  button1: function() {
    const _this = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        console.log('用户所选文件', tempFilePaths);
        // 把文件保存到本地
        for (let j = 0; j < tempFilePaths.length; j++) {
          let v = tempFilePaths[j];
          wx.saveFile({
            tempFilePath: v,
            success(res) {
              const savedFilePath = res.savedFilePath;
            }
          })
          wx.showToast({
            title: '上传成功！',
            icon: 'success',
            duration: 2000,
          }, _this.onLoad())
        }
      }
      //  }
    })
  },

  // 长按删除本地文件
  removeImg: function(e) {
    const _this = this;
    let imgPath = e.currentTarget.dataset.index1;
    wx.getSavedFileList({
      success(res) {
        if (res.fileList.length > 0) {
          wx.showModal({
            title: '图片删除',
            content: '确定删除此图片？',
            success(res) {
              if (res.confirm) {
                wx.removeSavedFile({
                  filePath: imgPath,
                  complete(res) {
                    console.log(res)
                  }
                })
                wx.showToast({
                  title: '删除成功！',
                  icon: 'success',
                  duration: 2000,
                }, _this.onLoad())
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },

  // 单击显示本地图片详情
  openImg: function(e) {
    let imgPath = e.currentTarget.dataset.index1;
    wx.previewImage({
      current: imgPath, // 当前显示图片的http链接
      urls: this.data.imgfile // 需要预览的图片http链接列表
    })
  },
  // 单击显示服务器图片详情
  openImg2: function(e) {
    let imgPath = e.currentTarget.dataset.index3;
    wx.previewImage({
      current: imgPath, // 当前显示图片的http链接
      urls: this.data.imgfiles // 需要预览的图片http链接列表
    })
  },

  // 文件上传到服务器
  button2: function() {
    const _this = this;
    wx.showLoading({
      title: '正在上传...',
    });
    wx.chooseMessageFile({
      count: 1, //能选择文件的数量
      type: 'file', //能选择文件的类型,我这里只允许上传文件.还有视频,图片,或者都可以
      success(res) {
        var size = res.tempFiles[0].size;
        if (size > 10485760) { //可以进行限制文件的大小和具体文件类型
          wx.showToast({
            title: '文件大小不能超过10MB!',
            icon: "none",
            duration: 2000,
            mask: true
          })
        } else {
          _this.setData({
            path: res.tempFiles[0].path, //将文件的路径保存在页面的变量上,方便 wx.uploadFile调用
          })
          console.log("filePath", _this.data.path);
          var token = wx.getStorageSync('userToken') || [];
          var key = Math.random().toString(36).substr(2);
          // 上传到服务器
          wx.uploadFile({
            url: 'http://wiki.fudengtech.com:8181/common/file/upload', //上传的路径
            filePath: _this.data.path, //刚刚在data保存的文件路径
            name: 'file', //后台获取的凭据
            success(res) {
              console.log("结果1", res);
              let datas = JSON.parse(res.data);
              console.log("结果2", datas);
              // 判断是否是图片，是图片就让其直接显示
              let x = datas.data.url;
              let imgs = x.substring(x.lastIndexOf('.') + 1).toUpperCase();
              if (imgs == "BMP" || imgs == "JPG" || imgs == "JPEG" || imgs == "PNG" || imgs == "GIF") {
                var arr1 = [];
                arr1.push(datas.data.url);
                _this.setData({
                  imgfiles: [..._this.data.imgfiles, ...arr1]
                })
                console.log("imgfiles", _this.data.imgfiles);
                setTimeout(function () {
                  wx.hideLoading()
                });
                wx.showToast({
                  title: '上传成功！',
                  icon: 'success',
                  duration: 2000,
                }, _this.onLoad())
              } else {
                var arr2 = [];
                arr2.push(datas.data.url);
                _this.setData({
                  files: [..._this.data.files, ...arr2]
                })
                console.log("files", _this.data.files);
                setTimeout(function () {
                  wx.hideLoading()
                });
                wx.showToast({
                  title: '上传成功！',
                  icon: 'success',
                  duration: 2000,
                }, _this.onLoad())
              }
            }
          })
        }
      }
    })
  },

  // 文件下载
  downFile: function(e) {
    var _this = this;
    wx.showLoading({
      title: '正在下载...',
    });
    // 获取文件url
    let fileUrl = e.currentTarget.dataset.index2;
    // 获取文件命名
    let name = fileUrl.substring(fileUrl.lastIndexOf('.', fileUrl.lastIndexOf('.') - 1) + 20);
    console.log("name", name);
    // 新建数组用于保存所下载的图片或文件，便于unlink删除
    var arr1 = [];
    wx.downloadFile({
      url: fileUrl,
      filePath: wx.env.USER_DATA_PATH + '/' + name, // 自定义路径加文件名和格式，防止出现后缀为unkown,但此路径下最多只能存10M
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log("res", res);
          let nameType = fileUrl.substring(fileUrl.lastIndexOf('.') + 1).toUpperCase();
          // 判断是否为音频
          if (nameType == "MP3" || nameType == "M4A" || nameType == "WAV" || nameType == "AAC") {
            setTimeout(function () {
              wx.hideLoading()
            });
            wx.showModal({
              title: '播放音频',
              content: '是否立刻播放该音频？',
              success(res) {
                if (res.confirm) {       
                  innerAudioContext.autoplay = true
                  innerAudioContext.src = wx.env.USER_DATA_PATH + '/' + name
                  innerAudioContext.onPlay(() => {
                    console.log('开始播放');
                  })
                  arr1.push(name);
                  _this.setData({
                    name: [..._this.data.name, ...arr1],
                  })
                  innerAudioContext.onError((res) => {
                    console.log(res.errMsg)
                    console.log(res.errCode)
                    wx.showToast({
                      title: '格式暂不支持！，用MP3格式试试看',
                      icon: "none",
                      duration: 3000,
                    })
                    _this.onUnload();
                  })                  
                 
                } else {
                  console.log("取消播放.");
                  arr1.push(name);
                  _this.setData({
                    name: [..._this.data.name, ...arr1],
                  })
                }
              }
            })
          } else if (nameType == "MP4" || nameType == 'M3U8') {
            // 如果是视频则保存到用户相册，让用户自行查看
            setTimeout(function () {
              wx.hideLoading()
            });
            wx.saveVideoToPhotosAlbum({
              filePath: wx.env.USER_DATA_PATH + '/' + name,
              success(res) {
                console.log(res.errMsg);
                wx.showToast({
                  title: '下载成功！文件已下载到相册中',
                  icon: "none",
                  duration: 3000,
                })
                arr1.push(name);
                _this.setData({
                  name: [..._this.data.name, ...arr1],
                })
              },
              fail(res) {
                wx.showToast({
                  title: '格式暂不支持！，用MP4格式试试看',
                  icon: "none",
                  duration: 3000,
                })
              }
            })
          } else {
            // 文档
            setTimeout(function () {
              wx.hideLoading()
            });
            wx.openDocument({
              filePath: wx.env.USER_DATA_PATH + '/' + name,
              success: function(res) {
                console.log('打开文档成功');
                arr1.push(name);
                _this.setData({
                  name: [..._this.data.name, ...arr1],
                });
              },
            })
          }
          _this.onLoad();
        }
      },
      fail: function() {
        wx.showToast({
          title: '文件不能大于10M！',
          icon: "none",
          duration: 3000,
        })
      }
    })
  },

  //结束播放
  listenerButtonStop() {
    var that = this
    innerAudioContext.stop()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    // 防止token失效
    app.disposePostToken();
    // 获取本地文件列表
    wx.getSavedFileList({
      success(res) {
        console.log("本地文件", res.fileList);
        var newArrImg = [];
        var newArrFile = [];
        // 区分是图片还是文件，分别保存，方便用于显示
        for (let j = 0; j < res.fileList.length; j++) {
          let x = res.fileList[j].filePath;
          let imgs = x.substring(x.lastIndexOf('.') + 1).toUpperCase();
          if (imgs == "BMP" || imgs == "JPG" || imgs == "JPEG" || imgs == "PNG" || imgs == "GIF") {
            newArrImg.push(x);
          } else {
            newArrFile.push(x);
          }
        }
        _this.setData({
          imgfile: newArrImg,
          file: newArrFile
        })
      }
    })
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
    // 使用unlink删除本地缓存（因为本地缓存只有10M）
    let fileMgr = wx.getFileSystemManager();
    for (var i = 0; i < this.data.name.length; i++) {
      let names = this.data.name[i];
      fileMgr.unlink({
        filePath: wx.env.USER_DATA_PATH + '/' + names,
        success: function(r) {
          console.log("删除成功", r);
        },
      })
    }
    this.listenerButtonStop();
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

  }
})
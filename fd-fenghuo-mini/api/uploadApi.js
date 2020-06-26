const config = require('../config/config.js');
/**
 *获取用户openid 
 */
const uploadPic = (filePath, url) => {
  url = url || config.upload.file;
  console.log("url",url);
  console.log("filePath", filePath);
  //构建参数
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: url, //接口地址
      filePath: filePath,
      name: 'file',
      formData: {},
      success(res) {
        try {
          //返回图片路径,对返回的结果进行处理
          let data = JSON.parse(res.data);
          if (data.code == 0 || data.code == 2001) {
            resolve({
              "code": 0, //成功
              "path": data.data.path
            });
          } else {
            resolve({
              "code": 2001, //失败
              "path": ""
            });
          }
        } catch (err) {
          resolve({
            "code": 2001, //失败
            "path": ""
          });
        }
      },
      fail(err) {
        wx.showToast({
          title: '文件上传失败',
          icon: 'none'
        })
        reject(err);
      }
    })
  })
}

module.exports = {
  uploadPic: uploadPic
}
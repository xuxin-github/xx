/**
 * 用于验证用户的信息
 */
function checkAuth(repData) {
  console.log("正在验证用户身份", repData.statusCode);
  if (repData.statusCode == "401") {
    wx.reLaunch({
      url: '/pages/login/login',
    })
  }
}

module.exports = {
  checkAuth: checkAuth
}
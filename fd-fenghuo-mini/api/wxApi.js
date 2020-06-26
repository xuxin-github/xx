const jwsRequest = require('../utils/jwsRequest.js');

/**
 *获取用户openid 
 */
const getWxOpenid = () => {
  //构建参数
  return new Promise((resolve, reject) => {
    jwsRequest.request("/weixin/wxxcxfangguan/getCommittees").then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    })
  })
}

module.exports = {
  getWxOpenid: getWxOpenid
}
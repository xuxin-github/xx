const jwsRequest = require('../utils/jwsRequest.js');
/**
 * @param {请求方式，接口地址} params 
 */
const gen = params => {
  let url = params;
  let method = 'GET'
  //解析路径，设置请求方式
  const paramsArray = params.split(' ')
  if (paramsArray.length === 2) {
    method = paramsArray[0]   // 如：POST  请求方式
    url = paramsArray[1]   // /c/...       接口路径
  }
  //构建Api函数
  return function (dynamicParams, dynamicOption) {
    return jwsRequest.request(url, method, dynamicParams, dynamicOption);
  }
}

const APIFunction = api => {
  const API = {}
  for (const key in api) {
    API[key] = gen(api[key])
  }
  return API;
}

module.exports = APIFunction;
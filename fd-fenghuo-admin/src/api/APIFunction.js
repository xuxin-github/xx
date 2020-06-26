import request from '../utils/request';
import config from '../utils/config';
//调用服务器端数据
const apiPrefix = config.serverUrl == "/" ? "" : config.serverUrl;

/**
 * @param {请求方式，接口地址} params 
 */
const gen = params => {
  let url = (params.indexOf("http") == 0) ? params : (apiPrefix + params)
  let method = 'GET'

  const paramsArray = params.split(' ')
  if (paramsArray.length === 2) {
    method = paramsArray[0]
    url = apiPrefix + paramsArray[1]
  }

  return function (data) {
    return request({
      url,
      data,
      method,
    })
  }
}

const APIFunction = api => {
  const API = {}
  for (const key in api) {
    API[key] = gen(api[key])
  }
  return API;
}

export default APIFunction;
const APIFunction = require('./APIFunction.js');
const api = {
  genJwtToken: '/auth/genJwtToken',
  valiLogin: 'POST /login',
  queryUserInfo: '/api/auth/queryUserInfo',//get请求
  getRoleCode: 'POST /c/report/getRoleCode'
}
const API = APIFunction(api);

module.exports = API;